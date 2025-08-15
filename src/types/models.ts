import { Optional } from "sequelize";

export interface roleModelAttributes {
  id: string;
  roleName: string;
}
export type roleCreationAttributes = Optional<roleModelAttributes, "id">;

export interface UserModelAttributes {
  id?: string;
  firstName: string;
  lastName: string;
  userName?: string;
  email: string;
  role?: string;
  password: string;
  phone_number?: string;
  organization?: string;
  replies?: string;
  confirmPassword: string;
  isVerified?: boolean;
  isPasswordExpired?: boolean;
  lastTimePasswordUpdated?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserModelInclude extends UserModelAttributes {
  Roles: any;
}

export type UserCreationAttributes = Optional<
  UserModelAttributes,
  "userName"
> & {
  role?: string;
  firstName?: string;
  lastName?: string;
  phone_number?: string;
  gender?: string;
  birthDate?: Date;
  preferredLanguage?: string;
  preferredCurrency?: string;
  profileImage?: string;
  addressLine1?: string;
  addressLine2?: string;
  country?: string;
  city?: string;
  zipCode?: number;
};

export interface UserModelInclude extends UserModelAttributes {
  Roles: any;
}

export interface TokenModelAttributes {
  id: string;
  token: string;
}

export type TokenCreationAttributes = Optional<TokenModelAttributes, "id">;
