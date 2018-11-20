import EmailManagerAPI from '../../api/email';
import imagesData from "../../api/email/imagesData";

Meteor.startup(async () => {
    process.env.MAIL_URL = Meteor.settings.MAIL_URL;
    process.env.EMAIL_FROM = Meteor.settings.EMAIL_FROM;
    const {downloadUrl} = await backblaze.uploadEmailImages(Object.values(imagesData));
    global.EmailManager = new EmailManagerAPI({
        emailFrom : process.env.EMAIL_FROM,
        imagesBaseUrl : downloadUrl
    });
    console.log(EmailManager);
    EmailManager.sendWelcomeEmail("alphawaseem@gmail.com","LiquidRE",{
        name: "John",
        message: "Congratulations, we have confirmed your identity and you can now participate on LiquidRE.",
        messageFooterText: "Thanks!",
        actionDetails: {
          text: "Get Started",
          "message": "",
          link: "liquidre.io"
        }
      });
});