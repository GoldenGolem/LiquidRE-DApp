
import "./welcome.html";


import { Template } from "meteor/templating";


Template.Welcome_Email.helpers({
  emailDetails: {
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