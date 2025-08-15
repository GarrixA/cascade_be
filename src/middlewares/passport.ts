import { Request } from "express";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import database_models from "../database/config/db.config";
import { getRoleByName } from "../services/user.services";
import { hashPassword } from "../utils/passwords";
import { isValidPassword } from "../utils/passwords";

passport.serializeUser(function (user: any, done) {
  done(null, user);
});

passport.deserializeUser(function (user: any, done) {
  done(null, user);
});

passport.use(
  "register",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      try {
        // console.log("🔹 Registering User:", email);

        const role = await getRoleByName("CITIZEN");
        if (!role) {
          // console.error("❌ No role found!");
          return done(null, false, { message: "You are assigned to no role" });
        }

        const data = {
          email: email.trim(),
          password: await hashPassword(password),
          confirmPassword: await hashPassword(req.body.confirmPassword),
          userName:
            req.body.userName == null
              ? req.body.email.split("@")[0]
              : req.body.userName,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          // phone_number: req.body.phone_number,
          role: role?.dataValues.id as string,
          isActive: true,
          isVerified: false,
        };

        console.log("🔹 User Data to Create:", data);

        const userExist = await database_models.User.findOne({
          where: { email: data.email },
        });

        if (userExist) {
          // console.warn("⚠️ User already exists!");
          return done(null, false, { message: "User already exists!" });
        }

        const user = await database_models.User.create(data);
        // console.log("✅ User Created Successfully:", user);

        return done(null, user);
      } catch (error) {
        // console.error("❌ Error Registering User:", error);
        return done(error);
      }
    }
  )
);

passport.use(
  "login",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (_req: Request, email, password, done) => {
      //
      try {
        const user = await database_models.User.findOne({
          where: { email },
          include: [
            {
              model: database_models.Role,
              as: "Roles",
            },
          ],
        });

        const my_user = user?.toJSON();

        if (!user) return done(null, false, { message: "Wrong credentials!" });

        const currPassword = my_user?.password as string;

        const isValidPass = await isValidPassword(password, currPassword);

        if (!isValidPass) {
          return done(null, false, { message: "Wrong credentials!" });
        }

        if (!user.dataValues.isVerified) {
          return done(null, false, { message: "Verify your Account" });
        }
        return done(null, my_user);
      } catch (error) {
        done(error);
      }
    }
  )
);

export default passport;
