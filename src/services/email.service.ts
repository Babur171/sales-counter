// import nodemailer from 'nodemailer';
import config from '../config/config';
// import logger from '../config/logger';

// const transport = nodemailer.createTransport(config.email.smtp);

if (config.env !== 'test') {
  // transport
  //   .verify()
  //   .then(() => logger.info('Connected to email server'))
  //   .catch(() =>
  //     logger.warn(
  //       'Unable to connect to email server. Make sure you have configured the SMTP options in .env'
  //     )
  //   );
}

const sendEmail = async (to: string, subject: string, text: string) => {
  const msg = { from: config.email.from, to, subject, text };
  // await transport.sendMail(msg);
};

const sendResetPasswordEmail = async (to: string, token: string) => {
  const subject = 'Reset password';
  const resetPasswordUrl = `http://link-to-app/reset-password?token=${token}`;
  const text = `Dear user,
To reset your password, click on this link: ${resetPasswordUrl}
If you did not request any password resets, then ignore this email.`;
  await sendEmail(to, subject, text);
};

const sendNewPasswordEmail = async (email: string, password: string) => {
  const subject = 'Created New Employ';
  const text = `Dear user,
Your Email: ${email}
Your Password: ${password}
You can use these credentials for login.`;
  await sendEmail(email, subject, text);
};

const sendVerificationEmail = async (to: string, token: string) => {
  const subject = 'Email Verification';
  const verificationEmailUrl = `http://link-to-app/verify-email?token=${token}`;
  const text = `Dear user,
To verify your email, click on this link: ${verificationEmailUrl}`;
  await sendEmail(to, subject, text);
};

export default {
  // transport,
  sendEmail,
  sendResetPasswordEmail,
  sendVerificationEmail,
  sendNewPasswordEmail
};
