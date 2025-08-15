import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import randomatic from "randomatic";
import { User } from "../database/models/User";
import { sendEmail } from "../helpers/nodemailer";
import {
  generateAccessToken,
  TokenData,
  verifyAccessToken,
} from "../helpers/security_helpers";
import passport from "../middlewares/passport";
import {
  TokenModelAttributes,
  UserModelAttributes,
  UserModelInclude,
} from "../types/models";
import { InfoAttribute } from "../types/passport_types";
import { insert_function, read_function } from "../utils/db_methods";
import HTML_TEMPLATE from "../utils/email_template";
import { sendResponse } from "../utils/httpRceptions";
import { BASE_URL } from "../utils/keys";
import { validateToken } from "../validations/token_validations";
import database_models from "../database/config/db.config";
const { Role } = database_models;

const SALT_ROUNDS = 10;

const ACCESS_TOKEN_SECRET =
  process.env.ACCESS_TOKEN_SECRET || "default_secret_key";

/**
 * Function that handles user registration
 * @param req
 * @param res
 * @param next
 * @returns registered user
 */
const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (req.body) {
      passport.authenticate(
        "register",
        (err: Error, user: UserModelAttributes, info: InfoAttribute) => {
          if (err) {
            sendResponse(res, 400, "BAD REQUEST", "Missing an attribute");
            return;
          }
          if (info) {
            sendResponse(res, 409, "CONFLICT", info.message);
            return;
          }
          if (!user) {
            sendResponse(res, 400, "BAD REQUEST", "User registration failed");
            return;
          }

          req.login(user, async () => {
            const token = generateAccessToken({
              id: user?.id,
              role: user?.role!,
            });
            await insert_function<TokenModelAttributes>("Token", "create", {
              token,
            });
            const message = `
                        <div style="max-width: 600px;
    margin: 0 auto;
    background-color: #ffffff;
    padding: 20px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    border-radius: 8px;">
        <h3 style="color: #333333;">Welcome to cascade!</h3>
        <p>To complete your signup process, please verify your account by clicking the link below:</p> <br/> <br/>
        <a href="${BASE_URL}/users/account/verify/${token}" style="
      background-color: MediumSeaGreen;
      color: white;
      padding: 6px 20px;
      border: none;
      border-radius: 5px;
      text-decoration: none;
    ">Verify</a> <br/> <br/>
        <p>Thank you for joining us!</p>
        <p>Best regards,</p>
        <p>The cascade Technical Team</p>
    </div>
                        `;
            console.log("Ussssssseeeerrrr ============>>>>", user);
            await sendEmail({
              to: user?.email,
              subject: "Verify Email",
              html: HTML_TEMPLATE(message, "Account verification"),
            });
            sendResponse(
              res,
              201,
              "SUCCESS",
              "Account Created successfully, Please Verify your Account"
            );
          });
        }
      )(req, res, next);
    }
  } catch (error) {
    sendResponse(
      res,
      500,
      "SERVER ERROR",
      "Something went wrong!",
      (error as Error).message
    );
  }
};

/**
 * A function that handles user login
 * @param req
 * @param res
 * @param next
 * @returns
 *  - If the user is an agency, it sends a verification email with a link and OTP.
 */
const login = async (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate(
    "login",
    (error: Error, user: UserModelAttributes, info: InfoAttribute) => {
      if (error) {
        console.log("The error is =======>>>>", error);
        return sendResponse(res, 400, "BAD REQUEST", "Missing an attribute");
      }

      if (info) {
        return sendResponse(res, 400, "BAD REQUEST", info.message);
      }

      if (!user) {
        return sendResponse(res, 400, "BAD REQUEST", "Invalid credentials");
      }

      req.login(user, async (err: Error) => {
        if (err) {
          console.log("Login Error ==========>>>>>>>", err);
          return sendResponse(res, 400, "BAD REQUEST", "Bad Request!");
        }

        const { id, email, firstName, lastName, isPasswordExpired } = user;
        const role = (user as UserModelInclude).Roles?.roleName;

        let authenticationtoken: string;
        let tokenData: TokenData;

        if (role === "AGENCY") {
          // // OTP logic commented out
          // const otp = randomatic("0", 6);

          if (isPasswordExpired) {
            tokenData = { id, role, /* otp, */ isPasswordExpired };
          } else {
            tokenData = { id, role /*, otp */ };
          }
          authenticationtoken = generateAccessToken(tokenData);

          // const host = `${BASE_URL}/users`;
          // const authenticationlink = `${host}/2fa?token=${authenticationtoken}`;

          // const message = `Hello ${firstName + " " + lastName},<br><br>
          // You recently requested to log in to cascade app. To complete the login process, enter the following verification code:<br><br>
          // OTP: ${otp}<br><br>
          // Or click the link to complete your login:<br><br>
          // <a href='${authenticationlink}' style="
          // background-color: MediumSeaGreen;
          // color: white;
          // padding: 6px 20px;
          // border: none;
          // border-radius: 5px;
          // text-decoration: none;
          // ">Click here to login</a><br><br>
          // If you didn't request this, you can safely ignore this email. Your account is secure.<br><br>
          // Thank you,<br><br>The cascade Technical Team`;

          // const options = {
          //   to: email,
          //   subject: "Your Login Verification Code",
          //   html: HTML_TEMPLATE(message, "Account verification"),
          // };
          // await insert_function<TokenModelAttributes>("Token", "create", {
          //   token: authenticationtoken,
          // });

          // sendEmail(options);
          return sendResponse(
            res,
            200,
            "SUCCESS",
            "Login successful!",
            authenticationtoken
          );
        } else {
          if (isPasswordExpired) {
            tokenData = { id, role, isPasswordExpired };
          } else {
            tokenData = { id, role };
          }
          authenticationtoken = generateAccessToken(tokenData);
          return sendResponse(
            res,
            200,
            "SUCCESS",
            "Login successfully!",
            authenticationtoken
          );
        }
      });
    }
  )(req, res, next);
};

/**
 * Function that handles user account verification
 * @param req
 * @param res
 * @returns verified user
 */
const accountVerify = async (req: Request, res: Response): Promise<void> => {
  try {
    const token = await read_function<TokenModelAttributes>(
      "Token",
      "findOne",
      { where: { token: req.params.token } }
    );
    if (!token) {
      sendResponse(res, 404, "NOT FOUND", "Token not found");
    }

    const { user } = validateToken(token.token, ACCESS_TOKEN_SECRET as string);
    if (!user) {
      sendResponse(res, 400, "BAD REQUEST", "Invalid token");
      return;
    }
    await insert_function<UserModelAttributes>(
      "User",
      "update",
      { isVerified: true },
      { where: { id: user.id } }
    );
    await read_function<TokenModelAttributes>("Token", "destroy", {
      where: { id: token.id },
    });
    sendResponse(res, 200, "SUCCESS", "Email verified successfully!");
  } catch (error) {
    sendResponse(
      res,
      500,
      "SERVER ERROR",
      "Something went wrong!",
      (error as Error).message
    );
  }
};

/**
 * Function that fetches all users
 * @param req
 * @param res
 * @returns all users
 */
const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password", "confirmPassword"] },
    });
    res.status(200).json({ data: users });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error fetching users",
      error: (error as Error).message,
    });
  }
};

/**
 * Function get user by their ids
 * @param req
 * @param res
 * @returns single user
 */
const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id, {
      attributes: { exclude: ["password", "confirmPassword"] },
    });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.status(200).json({ data: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error fetching user",
      error: (error as Error).message,
    });
  }
};

/**
 * Function that update users info
 * @param req
 * @param res
 * @returns updated user
 */
const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    console.log(id);
    const { firstName, lastName, email, password, role } = req.body;

    const hashedPassword = password
      ? await bcrypt.hash(password, SALT_ROUNDS)
      : undefined;

    const updated = await User.update(
      { firstName, lastName, email, password: hashedPassword },
      { where: { id } }
    );

    console.log(updated, "Updated");

    if (!updated) {
      res.status(404).json({ message: "User not found" });
    }

    const updatedUser = await User.findByPk(id);
    res
      .status(200)
      .json({ message: "User updated successfully", data: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error updating user",
      error: (error as Error).message,
    });
  }
};

/**
 * Function that deletes user
 * @param req
 * @param res
 * @returns deleted user
 */
const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deleted = await User.destroy({ where: { id } });
    if (!deleted) {
      res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error deleting user",
      error: (error as Error).message,
    });
  }
};

/**
 * Function that handles two factor authentication
 * @param req
 * @param res
 * @returns verified user
 */
const two_factor_authentication = async (req: Request, res: Response) => {
  try {
    const { otp } = req.body;
    const { token } = req.params;
    const decodedToken = verifyAccessToken(token, res) as TokenData;
    if (decodedToken.otp) {
      if (decodedToken.otp && otp === decodedToken.otp) {
        await read_function<TokenModelAttributes>("Token", "destroy", {
          where: { token: token },
        });
        sendResponse(res, 200, "SUCCESS", "OTP verified!", token);
      } else {
        sendResponse(res, 400, "BAD REQUEST", "Invalid OTP");
      }
    }
  } catch (error: any) {
    sendResponse(
      res,
      500,
      "SERVER ERROR",
      "Something went wrong!",
      (error as Error).message
    );
  }
};

/**
 * Function that assigns an organization to a user
 * @param req
 * @param res
 * @returns assigned organization
 */
const assignUserOrganization = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.params;
    const { organization_name } = req.body;

    if (!organization_name) {
      sendResponse(res, 400, "BAD REQUEST", "organization_name is required");
      return;
    }
    console.log("User ID:", userId);
    // Find user and their role
    const user = await User.findByPk(userId, {
      include: [{ model: Role, as: "Roles" }],
    });

    console.log("User found:", user);

    if (!user) {
      sendResponse(res, 404, "NOT FOUND", "User not found");
      return;
    }

    // Access roleName safely
    const roleInstance = (user as any).Roles;
    const roleName = roleInstance?.roleName;
    if (roleName !== "AGENCY") {
      sendResponse(
        res,
        403,
        "FORBIDDEN",
        "Only AGENCY users can be assigned an organization"
      );
      return;
    }

    // Find or create organization by name
    let organization = await read_function<any>(
      "Organization" as any,
      "findOne",
      { where: { organization_name } }
    );

    if (!organization) {
      organization = await insert_function<any>(
        "Organization" as any,
        "create",
        { organization_name }
      );
    }

    // Update user's organization field
    await User.update(
      { organization: organization.id },
      { where: { id: userId } }
    );

    sendResponse(res, 200, "SUCCESS", "Organization assigned to user", {
      userId,
      organizationId: organization.id,
      organization_name: organization.organization_name,
    });
  } catch (error) {
    sendResponse(
      res,
      500,
      "ERROR",
      "Internal server error",
      (error as Error).message
    );
  }
};

export default {
  login,
  registerUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  accountVerify,
  two_factor_authentication,
  assignUserOrganization,
};
