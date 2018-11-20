import { Meteor } from 'meteor/meteor';
import Trustees from './trustees/trustees.js';
import IREOS from './ireos/ireos.js';
import FAQ from './faq/faq.js';
import { safeNumber } from "../../client/lib/helpers";


// can these be combined?
Template.registerHelper('fromWei', (wei) => {
    return safeNumber((wei / 1e18).toFixed(2));
});
Template.registerHelper('metaMaskFound', () => {
    return (typeof web3 !== 'undefined' && web3.currentProvider.isMetaMask);
});
Template.registerHelper('metaMaskLoggedIn', () => {
    return (typeof web3 !== 'undefined' && web3.currentProvider.isMetaMask && web3.eth.defaultAccount != null);
});
Template.registerHelper('unixTimeToStr', (unixTime) => {
    return moment.unix(unixTime).format('MMM Do, hh:mm:ss A ') + new Date().toString().match(/\(([A-Za-z\s].*)\)/)[1];
});
Template.registerHelper('getIREOs', () => {
    return ClientProperties.find({ status: { $nin: ['Trading', 'Frozen'] } });
});
Template.registerHelper('getLRETs', () => {
    return ClientProperties.find({ status: { $in: ['Trading', 'Frozen'] } });
});
Template.registerHelper('getProperty', (address) => {
    return ClientProperties.findOne({ address: address });
});
Template.registerHelper('formatCurrency', (n) => {
    n = safeNumber(n);
    var formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        // the default value for minimumFractionDigits depends on the currency
        // and is usually already 2
    });

    return formatter.format(n); /* $2,500.00 */
});
Template.registerHelper('formatNumber', (n) => {
    n = safeNumber(n);
    var formatter = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2
    });
    return formatter.format(n); /* $2,500.00 */
});
Template.registerHelper('safeNumber', (n) => {
    return safeNumber(n); // NaN -> 0
});
Template.registerHelper('getTrustees', () => {
    return ClientTrustees.find();
});
Template.registerHelper('trusteeInfo', () => {
    // Meteor.subscribe('trustees.info', web3.eth.defaultAccount);
    return ClientTrustees.findOne({ address: web3.eth.defaultAccount });
});
Template.registerHelper('getTrusteeName', (address) => {
    let trustee = ClientTrustees.findOne({ address: address });
    return trustee ? trustee.name : null;
});
Template.registerHelper('getWeb3AccountAddress', () => {
    return web3.eth.defaultAccount;
});
Template.registerHelper('formatDatetime', (n) => {
    return moment(n).format('LLL');
});
Template.registerHelper('divide', (a, b) => {
    if(a && b)
        return (new BigNumber(a).div(b)).valueOf();
    else
        return 0;
});
Template.registerHelper('multiply', (a, b) => {
    return a * b;
});
Template.registerHelper('getCountryByCode', (code) => {
    return COUNTRIES.find(el => { return el.code == code });
});
Template.registerHelper('isAdmin', () => {
    return Roles.userIsInRole(Meteor.userId(), ['Admin', 'Manager', 'Verifier']);
});
Template.registerHelper('inRole', (_role) => {
    return Roles.userIsInRole(Meteor.userId(), _role);
});
Template.registerHelper('isEqual', (a, b) => {
    return a == b;
});
Template.registerHelper('isDefaultAccountSellerOrTrustee', (_seller, _trustee) => {
    return web3.eth.defaultAccount == _seller || web3.eth.defaultAccount == _trustee;
});
Template.registerHelper('isLess', (a, b) => {
    return a < b;
});
Template.registerHelper('isLessEqual', (a, b) => {
    return a <= b;
});
Template.registerHelper('isGreater', (a, b) => {
    return a > b;
});
Template.registerHelper('isGreaterEqual', (a, b) => {
    return a >= b;
});
Template.registerHelper('isDefaultAccount', (address) => {
    return address == web3.eth.defaultAccount;
});
Template.registerHelper('IREOFiles', (address) => {
    if (address) {
        Meteor.subscribe('ireos.info', address);
        return IREOS.findOne({ address: address });
    } else
        return null;
});
Template.registerHelper('getAllQA', () => {
    Meteor.subscribe('faq.all');
    return FAQ.find();
});

Template.registerHelper('percent', (a, b) => {
    return (a / b * 100) || 0;
});
Template.registerHelper('getYoutubeVideoCode', (url) => {
    var match = url.match(/^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/);
    return (match && match[7].length == 11) ? match[7] : false;
});
Template.registerHelper('fileLinkURL', (_id) => {
    return ReactiveMethod.call("file.url", _id);
});
Template.registerHelper('getUser', (address) => {

    if(address) {
        Meteor.subscribe('users.profile', address);
        let user = Meteor.users.findOne({
            username: address
        });
        return (user) ? user : null;
    } else return null;
});
Template.registerHelper('getSuccessfulIreos', (sellerAddress) => {
    Meteor.subscribe('ireos.seller', sellerAddress);
    status = IREOS.find({ seller: sellerAddress }).status;
    return getNumberOfIreosByStatus(status, 'Successful');
});
Template.registerHelper('getFailedIreos', (sellerAddress) => {
    Meteor.subscribe('ireos.seller', sellerAddress);
    status = IREOS.find({ seller: sellerAddress }).status;
    return getNumberOfIreosByStatus(status, 'Failed');
});
Template.registerHelper('getPendingIreos', (sellerAddress) => {
    Meteor.subscribe('ireos.seller', sellerAddress);
    status = IREOS.find({ seller: sellerAddress }).status;
    return getNumberOfIreosByStatus(status, 'On-progress');
});
Template.registerHelper('tpegBalance', () => {
    let res = ClientStableToken.findOne({});
    return res ? res.myBalance : 0;
});
Template.registerHelper('getCurrentNetworkUrl', () => {
    const netId = global.currentNetwork;

    switch (netId) {
        case 1:
          return "";
        case 2:
          return "";
        case 3:
          return "https://ropsten.etherscan.io/tx/";
        default:
      }
});

function getNumberOfIreosByStatus(currentStatus, status) {
    let i;
    let count = 0;
    for (i = 0; i < currentStatus.length; i++) {
        if (currentStatus[i] === status) {
            count++;
        }
    }
    return count;
}
