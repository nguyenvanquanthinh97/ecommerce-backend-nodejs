"use strict";

const crypto = require("crypto");
const OTPService = require("./otp.service");
const TemplateService = require("./template.service");
const transport = require("../dbs/init.nodemailer");
const { NotFoundError } = require("../core/error.response");
const { replacePlaceholder } = require("../utils");

class EmailService {
  static sendEmailLinkVerify = ({
    html,
    toEmail,
    subject = "Verify registered email !",
    text = "Confirm...",
  }) => {
    try {
      const mailOptions = {
        from: `"ShopDEV" <${process.env.AWS_SES_SMTP_FROM}>`,
        to: toEmail,
        subject,
        text,
        html,
      };

      transport.sendMail(mailOptions, (err, info) => {
        if (err) {
          return console.log(err);
        }

        console.log("Message sent::", info.messageId);
      });
    } catch (error) {
      console.error(`error send Email::`, error);
      return error;
    }
  };

  static sendEmailToken = async ({ email = null }) => {
    try {
      // 1. get Token
      const token = await OTPService.newOtp({ email });

      // 2. get Template
      const template = await TemplateService.getTemplate({
        tem_name: "HTML EMAIL TOKEN",
      });

      if (!template) {
        throw new NotFoundError('Template not found')
      }

      // 3. replace placeholder with params
      const content = replacePlaceholder(
        template.tem_html,
        {
          link_verify: `http://localhost:3056/cgp/welcome-back?token=${token}`
        }
      )

      // 4. send email
      await this.sendEmailLinkVerify({
        html: content,
        toEmail: email,
        subject: "Vui lòng xác nhận địa chỉ email đăng ký ShopDEV.com!",
      }).catch(err => console.error(err));

      return 1;
    } catch (error) {}
  };
}

module.exports = EmailService;
