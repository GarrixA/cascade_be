// User model
import { DataTypes, Model, Sequelize, UUIDV4 } from "sequelize";
import {
  UserCreationAttributes,
  UserModelAttributes,
} from "../../types/models";
import database_models from "../config/db.config";

export class User extends Model<UserModelAttributes, UserCreationAttributes> {
  public static associate(models: {
    Role: typeof database_models.Role;
    Products: typeof database_models.Products;
  }) {
    User.belongsTo(models.Role, { as: "Roles", foreignKey: "role" });

    User.hasMany(models.Products, {
      foreignKey: "userId",
      as: "products",
    });
  }
}

const user_model = (sequelize: Sequelize) => {
  User.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
      },
      firstName: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      lastName: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      email: {
        allowNull: false,
        unique: true,
        type: DataTypes.STRING,
      },
      role: {
        allowNull: false,
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        references: {
          model: "Roles",
          key: "id",
        },
      },
      password: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      confirmPassword: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      isPasswordExpired: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      phone_number: {
        allowNull: true,
        unique: true,
        type: DataTypes.STRING,
      },

      // organization: {
      //   allowNull: true,
      //   type: DataTypes.UUID,
      //   references: {
      //     model: "Organization",
      //     key: "id",
      //   },
      // },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "User",
    }
  );
  return User;
};

export default user_model;
