import { sendContactEmail } from "../services/mail.service.js";
import { createContactService } from "../services/contact.service.js";

export const createContact = async (req, res) => {
  try {
    const { firstName, lastName, email, message } = req.body;

    if (!firstName || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    const contact = await createContactService({
      firstName,
      lastName,
      email,
      message,
    });

    // 📧 Send Email
    await sendContactEmail(contact);

    res.status(200).json({
      success: true,
      message: "email sent",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};