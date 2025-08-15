import database_models from "../database/config/db.config";

export const getRoleByName = async (roleName: string) => {
  return await database_models.Role.findOne({
    where: { roleName },
  });
};
