import "./entitiesRegister.html"
import "../../../stylesheets/register-entities.scss"
const ethUtil = require("ethereumjs-util")

Template.entitiesRegister.onCreated(function() {
  this.loginMessage = new ReactiveVar(null)
  this.isLogginIn = new ReactiveVar(false)
})

Template.entitiesRegister.helpers({
  loginMessage() {
    return Template.instance().loginMessage.get()
  },
  isLogginIn() {
    return Template.instance().isLogginIn.get()
  },
})

Template.entitiesRegister.events({
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
})
