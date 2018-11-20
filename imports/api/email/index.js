import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Email } from 'meteor/email';
import imagesData from "./imagesData";

SSR.compileTemplate("Email_Header", Assets.getText("emails/common/email_header.html"));
SSR.compileTemplate("Email_Footer", Assets.getText("emails/common/email_footer.html"));
SSR.compileTemplate("Email_Greetings", Assets.getText("emails/common/email_greetings.html"));
SSR.compileTemplate("Email_Action", Assets.getText("emails/common/action_details.html"));
SSR.compileTemplate("welcomeEmail", Assets.getText("emails/welcome/welcome.html"));
SSR.compileTemplate("notificationEmail", Assets.getText("emails/notification/notification.html"));
SSR.compileTemplate("confirmationEmail", Assets.getText("emails/confirmation/confirmation.html"));
SSR.compileTemplate("emailContainer", Assets.getText("emails/email.html"));

export const renderEmailTemplateAsString = (templateName, emailDetails) => {
  return SSR.render("emailContainer", {
    body: SSR.render(templateName, { emailDetails })
  });
}

export default class EmailManager {
  constructor(config = {
    emailFrom,
    imagesBaseUrl
  }) {
    this.from = config.emailFrom;
    this.imagesBaseUrl = config.imagesBaseUrl + "/file/" + Meteor.settings.backblaze.buckets.email.name + "/";
    this.imagesData = {
      headerImage: this.imagesBaseUrl + imagesData.headerImage,
      logo: this.imagesBaseUrl + imagesData.logo,
      fbIcon: this.imagesBaseUrl + imagesData.fbIcon,
      linkedInIcon: this.imagesBaseUrl + imagesData.linkedInIcon,
      twIcon: this.imagesBaseUrl + imagesData.twIcon
    }
  }

  sendHtmlEmail(template, to, subject, emailDetails) {
    const from = this.from;
    emailDetails = {
      ...emailDetails,
      ...this.imagesData
    }
    const html = renderEmailTemplateAsString(template, emailDetails);
    Email.send({
      to,
      from,
      subject,
      html
    });
  }

  sendWelcomeEmail(to, subject, emailDetails) {
    return this.sendHtmlEmail("welcomeEmail", to, subject, emailDetails);
  }

  sendConfirmationEmail(to, subject, emailDetails) {
    return this.sendHtmlEmail("confirmationEmail", to, subject, emailDetails);
  }

  sendNotificationEmail(to, subject, emailDetails) {
    return this.sendHtmlEmail("notificationEmail", to, subject, emailDetails);
  }

}
