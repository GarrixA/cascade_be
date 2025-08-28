import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import database_models from "../config/db.config";

interface ProductTranslationAttributes {
  id?: string;
  productId: string;
  language: string;
  title: string;
  description: string;
}

type ProductTranslationCreationAttributes = Optional<
  ProductTranslationAttributes,
  "id"
>;

export class ProductTranslation
  extends Model<
    ProductTranslationAttributes,
    ProductTranslationCreationAttributes
  >
  implements ProductTranslationAttributes
{
  public id!: string;
  public productId!: string;
  public language!: string;
  public title!: string;
  public description!: string;

  public static associate(models: any) {
    ProductTranslation.hasMany(models.Products, {
      foreignKey: "productId",
      as: "product",
    });
    models.Products.hasMany(ProductTranslation, {
      foreignKey: "productId",
      as: "products",
    });
  }
}

const ProductTranslation_model = (sequelize: Sequelize) => {
  ProductTranslation.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      productId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: "Products", key: "id" },
        onDelete: "CASCADE",
      },
      language: { type: DataTypes.STRING, allowNull: false },
      title: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: false },
    },
    {
      sequelize,
      tableName: "ProductTranslations",
    }
  );

  return ProductTranslation;
};

export default ProductTranslation_model;
