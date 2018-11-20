import {
  Meteor
} from 'meteor/meteor';
import {
  check
} from 'meteor/check';
import Trustees from './trustees.js';

Meteor.methods({
  'trustees.insert'(data) {
    if (Meteor.userId()) {
      let trustee = Trustees.findOne({ wallet: data.wallet });
      if (trustee)
        throw new Meteor.Error('Exist', 'Wallet address was already registered as trustee.');
      else {
        // send trustee welcome message
        console.log(Meteor.user());
        return Trustees.insert(data);
      }
    } else {
      throw new Meteor.Error('Forbidden', 'Member access needed.');
    }
  },
  'trustees.verify'(address) {
    if (Meteor.userId() && Roles.userIsInRole(Meteor.userId(), ['Admin'])) {
      let user = Meteor.users.findOne({
        username: address
      });
      if (user) {
        let email = user.emails[0].address;
        EmailManager.sendWelcomeEmail(email, "Trustee status approved", {
          name: user.profile.name,
          message: "Congratulations,  you are now registered Trustee on LiquidRE.",
          actionDetails: {
            text: "Get Started",
            "message": "",
            link: "http://liquidre.io/lrets"
          }
        });
      }
      return Trustees.update({
        wallet: address
      }, {
          $set: {
            verified: true
          }
        });
    } else {
      throw new Meteor.Error('Forbidden', 'Admin access needed.');
    }
  },
});