import "./notification.html";

import { Template } from "meteor/templating";


Template.Notification_Email.helpers({
  emailDetails: {
    greetingType : "Hi",
    name: "John",
    message: "Thank you for listing your IREO located at {IREO_Property_Address}!",
    messageFooterText: "Your IREO is now open for bids from Trustees on our network. You will be notified when bids are received.",
    notificationDetails : {
      image : "/images/list_home.jpg",
      heading : "{IREO_ID}",
      info : "325 N Spokane St",
      footer : "32, 000 SF"
    },
    actionDetails: {
      text: "View Property",
      "message": "Thanks! The LiquidRE Team",
      link: "liquidre.io"
    }
  }
})