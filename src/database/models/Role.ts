import { DataTypes, Model, Optional, Sequelize, UUIDV4 } from "sequelize";
import database_models from "../config/db.config";

interface UserAttributes {
  id?: string;
  roleName: string;
}

type RoleCreationAtribute = Optional<UserAttributes, "id">;
class Role extends Model<UserAttributes, RoleCreationAtribute> {
  public static associate(models: { User: typeof database_models.User }) {
    Role.hasMany(models.User, { as: "User", foreignKey: "role" });
  }
}

const Role_model = (sequelize: Sequelize) => {
  Role.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      roleName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "Roles",
    }
  );
  return Role;
};
export default Role_model;
