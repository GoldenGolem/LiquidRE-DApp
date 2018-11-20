import "./confirmation.html";

import { Template } from "meteor/templating";


Template.Confirmation_Email.helpers({
  emailDetails: {
    greetingType : "Welcome",
    name: "John",
    message: "Congratulations, we have confirmed your identity and you can now participate on LiquidRE.",
    messageFooterText: "Thanks!",
    actionDetails: {
      text: "Get Started",
      "message": "",
      link: "liquidre.io"
    }
  }
})