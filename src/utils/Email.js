import pug from "pug";
import nodemailer from "nodemailer";
import { htmlToText } from "html-to-text";

export default class Email {
  constructor(user) {
    this.user = user;
    this.to = user.email;
    this.firstName = user.firstName;
    this.from = `${process.env.APP_NAME} <${process.env.MAIL_FROM}>`;
  }

  /**
   * Creates the email transport
   */
  createEmailTransport() {
    if (process.env.NODE_ENV === "PRODUCTION") {
      // Sendgrid
      return 1;
    }

    // 1) Create a transporter
    return nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    });
  }

  /**
   * Send the actual email
   */
  async send(subject, template, templateParameters) {
    // 1) Render HTML based on a PUG template
    const html = pug.renderFile(
      `${__dirname}/../views/email/${template}.pug`,
      templateParameters
    );

    // 2) Define the email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText(html),
    };

    // Create a transport and send email
    await this.createEmailTransport().sendMail(mailOptions);
  }

  /**
   * Send email on New User Registration
   */
  async sendWelcome(token) {
    const url = `${process.env.APP_URL}/api/v1/auth/email/verify/${token}`;
    const subject = `Welcome to the ${process.env.APP_NAME} family !`;
    const templateParameters = {
      url,
      subject,
      firstName: this.firstName,
      appName: process.env.APP_NAME,
    };

    await this.send(subject, "welcome", templateParameters);
  }

  /**
   * Send email of Reset Password Link
   */
  async sendResetPasswordLink(token) {
    const url = `${process.env.APP_URL}/api/v1/auth/reset-password/${this.user.email}/${token}`;
    const subject = `Reset your password !`;
    const templateParameters = {
      url,
      subject,
      firstName: this.firstName,
      appName: process.env.APP_NAME,
    };

    await this.send(subject, "resetPassword", templateParameters);
  }
}
