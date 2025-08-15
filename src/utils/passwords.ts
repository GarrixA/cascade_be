import bcrypt from "bcrypt";
export const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPass = await bcrypt.hash(password, salt);
  return hashedPass;
};

export const isValidPassword = async (
  password: string,
  currPass: string
): Promise<boolean> => {
  const isValid = bcrypt.compareSync(password, currPass);

  return isValid;
};
