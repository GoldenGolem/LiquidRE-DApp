import './login.html';
import '../../stylesheets/login.scss';
const ethUtil = require('ethereumjs-util');

Template.login.onCreated(function () {
    if(!web3 || (web3 && !web3.currentProvider.isMetaMask)){
        Router.go("entities/register");
    }
    updateDefaultAccount();
});

Template.login.helpers({
    web3Found() {
        return !!web3;
    },
    coinbaseFound() {
        return !!web3.eth.defaultAccount 
    }
});