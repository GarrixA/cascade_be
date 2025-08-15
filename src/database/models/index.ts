import { Sequelize } from "sequelize";
import Role_model from "./Role";
import user_model from "./User";
import token_model from "./Token";
import category_model from "./Category";
import product_model from "./Product";
import Organization_model from "./Organization";

const Models = (sequelize: Sequelize) => {
  const User = user_model(sequelize);
  const Role = Role_model(sequelize);
  const Token = token_model(sequelize);
  const Category = category_model(sequelize);
  const Products = product_model(sequelize);
  const Organization = Organization_model(sequelize);

  return { User, Role, Token, Category, Products, Organization };
};

export default Models;
