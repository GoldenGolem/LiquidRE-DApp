import {
    Meteor
} from 'meteor/meteor';
import './admin.html';

Template.admin.onCreated(function adminOnCreated() {
    if(redirectingToLogin()) return;    
    this.myRoles = new ReactiveVar('  ');
    if (typeof web3 !== 'undefined' && web3.eth.defaultAccount != null) {
        let checkStatus = () => {
            if (typeof liquidRE !== 'undefined') {
                cbWrap(liquidRE.methods.administratorInfo(web3.eth.defaultAccount).call, res => {
                    if (res[0]) {
                        this.myRoles.set(this.myRoles.get() + 'Administrator, ');
                    }
                });
                cbWrap(liquidRE.methods.managerInfo(web3.eth.defaultAccount).call, res => {
                    if (res[0]) {
                        this.myRoles.set(this.myRoles.get() + 'Manager, ');
                    }
                });
                cbWrap(liquidRE.methods.verifierInfo(web3.eth.defaultAccount).call, res => {
                    if (res[0]) {
                        this.myRoles.set(this.myRoles.get() + 'Verifier, ');
                    }
                });
                cbWrap(liquidRE.methods.investorInfo(web3.eth.defaultAccount).call, res => {
                    if (res[0]) {
                        this.myRoles.set(this.myRoles.get() + 'Investor, ');
                    }
                });
                if (ClientTrustees.findOne({
                        address: web3.eth.defaultAccount
                    })) {
                    this.myRoles.set(this.myRoles.get() + 'Trustee, ');
                }
                if (ClientSellers.findOne({
                        address: web3.eth.defaultAccount
                    })) {
                    this.myRoles.set(this.myRoles.get() + 'Seller, ');
                }
            } else if (Router.current().route.getName() == 'admin') {
                setTimeout(checkStatus, 500);
            }
        }
        checkStatus();
    }
});

Template.admin.events({
    'click .btn-verify-seller': function (event, template) {
        let address = $(event.target).data('address');
        processTx(liquidRE.methods.addSeller(address));
    },
    'click .btn-verify-investor': function (event, template) {
        let address = (typeof $(event.target).data('address') != "undefined") ? $(event.target).data('address') : '';
        let country = (typeof $(event.target).data('country') != "undefined") ? $(event.target).data('country') : '';
        processTx(liquidRE.methods.addInvestor(address, country));
    },
    'click .btn-verify-trustee': function (event, template) {
        let address = (typeof $(event.target).data('address') != "undefined") ? $(event.target).data('address') : '';
        let name = (typeof $(event.target).data('name') != "undefined") ? $(event.target).data('name') : '';
        let mailing_address = (typeof $(event.target).data('mailingaddress') != "undefined") ? $(event.target).data('mailingaddress') : '';
        processTx(liquidRE.methods.addTrustee(address, name, mailing_address));
    },
    'submit #add-new-trustee': (event, template) => {
        processTx(liquidRE.methods.addTrustee(event.target.address.value, event.target.name.value, event.target.mailingAddress.value));
    },
    'submit #add-new-investor': (event, template) => {
        processTx(liquidRE.methods.addInvestor(event.target.address.value, event.target.countryCode.value));
    },
    'submit #add-new-seller': (event, template) => {
        processTx(liquidRE.methods.addSeller(event.target.address.value));
    },
    'submit #add-new-administrator': (event, template) => {
        processTx(liquidRE.methods.addAdministrator(event.target.address.value));
    },
    'submit #add-new-manager': (event, template) => {
        processTx(liquidRE.methods.addManager(event.target.address.value));
    },
    'submit #add-new-verifier': (event, template) => {
        processTx(liquidRE.methods.addVerifier(event.target.address.value));
    },
    'submit #issue-tpegs': (event, template) => {
        processTx(stableToken.methods.issue(event.target.address.value, new BigNumber(event.target.amount.value).times(1e18)));
    },
    'submit #delete-me': (event, template) => {
        processTx(liquidRE.methods.deleteMe());
    },
    'submit #frm-init-rent': function (event, template) {
        processTx(rentLogic.methods.initializeRENT(new BigNumber(event.target.tpeg.value * 1e18), new BigNumber(event.target.rent.value * 1e18), event.target.weight.value));
    },
    'click .btn-approve-init-rent': (event, template) => {
        let tpegAmount = new BigNumber(template.find('#init-rent-tpeg-amount').value * 1e18);
        console.log(tpegAmount.valueOf());
        stableToken.methods.approve(rentLogic.options.address, tpegAmount).send({ from: web3.eth.defaultAccount });
    }
});

Template.admin.helpers({
    'getRoles' () {
        return Template.instance().myRoles.get().slice(0, -2);
    },
    'getTrustees' () {
        return ClientTrustees.find();
    },
    'getInvestors' () {
        return ClientInvestors.find();
    },
    'getSellers' () {
        return ClientSellers.find();
    },
    'getAdministrators' () {
        return ClientAdministrators.find();
    },
    'getManagers' () {
        return ClientManagers.find();
    },
    'getVerifiers' () {
        return ClientVerifiers.find();
    },

    'getSellerApplicants' () {
        Meteor.subscribe('users.seller-applicants');
        return Meteor.users.find({
            seller_status: 'Pending'
        });
    },
    'getInvestorApplicants' () {
        Meteor.subscribe('users.investor-applicants');
        return Meteor.users.find({
            investor_status: 'Pending'
        });
    },
    'getTrusteeApplicants' () {
        Meteor.subscribe('users.trustee-applicants');
        return Meteor.users.find({
            trustee_status: 'Pending'
        });
    }
});