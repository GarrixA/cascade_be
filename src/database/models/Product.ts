import { DataTypes, Model, Sequelize, UUIDV4 } from "sequelize";

interface ProductAttributes {
  id?: string;
  title: string;
  description: string;
  images: string[];
  categoryId?: string;
  userId?: string;
  status?: string;
  isAvailable?: boolean;
  price?: number;
  code?: string;
}

export class Products
  extends Model<ProductAttributes>
  implements ProductAttributes
{
  public id!: string;
  public title!: string;
  public description!: string;
  public images!: string[];
  public categoryId!: string;
  public userId!: string;
  public status!: string;
  public isAvailable!: boolean;
  public price!: number;
  public code!: string;

  public static associate(models: any) {
    Products.belongsTo(models.Category, {
      foreignKey: "categoryId",
      as: "category",
    });
    Products.belongsTo(models.User, { foreignKey: "userId", as: "user" });
    Products.hasMany(models.ProductTranslation, {
      foreignKey: "productId",
      as: "translations",
    });
  }
}

const product_model = (sequelize: Sequelize) => {
  Products.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      title: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.STRING, allowNull: false },
      status: { type: DataTypes.STRING, allowNull: false },
      images: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: false },
      categoryId: { type: DataTypes.UUID, allowNull: false },
      userId: { type: DataTypes.UUID, allowNull: false },
      isAvailable: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      code: { type: DataTypes.STRING(5), allowNull: true, unique: true },
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
