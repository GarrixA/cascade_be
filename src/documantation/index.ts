import basicInfo from "./basicInfo";
import { roles } from "./role";
import { users } from "./user";
import { categories } from "./category";
import { products } from "./product";
import { organizations } from "./organization";

export default {
  ...basicInfo,
  paths: {
    ...users,
    ...roles,
    ...categories,
    ...products,
    ...organizations,
  },
};
