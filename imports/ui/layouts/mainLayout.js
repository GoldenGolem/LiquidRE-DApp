import './mainLayout.html';
import Notifications from '../../api/notifications/notifications.js';
import { Tracker } from 'meteor/tracker'
const ethUtil = require("ethereumjs-util")

Template.mainLayout.onCreated(function() {
    this.loginMessage = new ReactiveVar(null)
    this.isLogginIn = new ReactiveVar(false)
    Meteor.subscribe('notifications.unseen', {
        onReady: () => {
            const cursor = Notifications.find({});
            const handle = cursor.observeChanges({
                added(_id, _notification) {
                    if(!_notification.alertSent) {
                        Bert.alert( _notification.description, "success", "growl-top-right" );
                        Meteor.call('notifications.alertSent', _id);
                    }
                }
            });
        }
    });
    updateDefaultAccount();
});

Template.mainLayout.helpers({
    metamaskNetwork() {
        let network = NETWORKS.find((el)=>{
            return el.version == localStorage.getItem("currentNetwork");
        });
        return network ? network.name : 'Private Network';
    },
    notificationsCount() {
        return Notifications.find({}).count();
    },
    loginMessage() {
        return Template.instance().loginMessage.get()
    },
    isLogginIn() {
      return Template.instance().isLogginIn.get()
    },
});

Template.mainLayout.events({
    'click #log-out': function(event, template) {
        Meteor.logout(()=>{
            Router.go('/');
        })
    },
    "click #eth-login": function(event, template) {
    let text = "Login with Ethereum"
    let msg = ethUtil.bufferToHex(new Buffer(text, "utf8"))
    let from = web3.eth.defaultAccount
    let msgHash = ethUtil.hashPersonalMessage(new Buffer(text, "utf8"))
    if (web3.currentProvider.isMetaMask) {
      template.loginMessage.set("Trying to login...")
      template.isLogginIn.set(true)
      web3.eth.personal.sign(msg, from, function(err, result) {
        
        if (err) template.loginMessage.set("Error logging in, please try again...")
        Meteor.loginWithETH(msgHash, result, from, function(err, res) {
          template.isLogginIn.set(true)
          if (err) {
            template.loginMessage.set("Error logging in, please try again...")
          } else {

            if (new RegExp(location.host).test(document.referrer)) {
                // referer is part of our domain name
                history.back();
            } else {
                // came from another site redirect to profile
                // Router.go('/');
                history.back();
            }
          }
        })
      })
    }
  },
});