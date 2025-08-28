import basicInfo from "./basicInfo";
import { roles } from "./role";
import { users } from "./user";
import { categories } from "./category";
import { products } from "./product";
import { organizations } from "./organization";
import { translations } from "./translation";

export default {
  ...basicInfo,
  paths: {
    ...users,
    ...roles,
    ...categories,
    ...products,
    ...organizations,
    ...translations, // <-- Add this line
  },
};
