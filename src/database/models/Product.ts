import { DataTypes, Model, Sequelize, UUIDV4 } from "sequelize";
import { Category } from "./Category";
import { User } from "./User";

interface ItemsAttributes {
  id?: string;
  title: string;
  description: string;
  images: string[];
  categoryId?: string;
  userId?: string;
  status?: string;
  isAvailable?: boolean;
  price?: number; // 👈 new
}

export class Products
  extends Model<ItemsAttributes>
  implements ItemsAttributes
{
  public images!: string[];
  public id!: string;
  public categoryId!: string;
  public userId!: string;
  public description!: string;
  public title!: string;
  public status!: string;
  public isAvailable!: boolean;
  public price!: number; // 👈 new

  public static associate(models: {
    Category: typeof Category;
    User: typeof User;
  }) {
    Products.belongsTo(models.Category, {
      foreignKey: "categoryId",
      as: "category",
    });

    Products.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
    });
  }
}

const product_model = (sequelize: Sequelize) => {
  Products.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
      },
      title: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      description: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      status: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      images: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
      },
      categoryId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "Categories",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "User",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      isAvailable: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2), // 👈 new
        allowNull: false,
        defaultValue: 0.0,
      },
    },
    {
      sequelize,
      modelName: "Products",
      tableName: "Products",
    }
  );

  return Products;
};

export default product_model;
