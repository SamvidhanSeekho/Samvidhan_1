import { User } from "../models/user.model.js";

export const createUserService = async (data) => {
  return await User.create(data);
};

export const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};