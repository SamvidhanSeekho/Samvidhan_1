import { Contact } from "../models/contact.model.js";

export const createContactService = async (data) => {
  return await Contact.create(data);
};