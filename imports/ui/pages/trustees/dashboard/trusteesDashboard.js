 import './trusteesDashboard.html';
import '../../../stylesheets/trustees-dashboard.scss';
 
 Template.trusteesDashboard.onCreated(function () {
    /*this.trustsInfo = new ReactiveVar([]);
    let trustObj= TrusteeContract.at(web3.eth.defaultAccount);
    trustObj.trustAddresses.call((err, res) => {
        if (!err) {
            this.trustsInfo.set(res);

         }
    });*/
    this.trustsAddress = new ReactiveVar(web3.eth.defaultAccount);
    updateDefaultAccount();
 });

 Template.trusteesDashboard.helpers({
    /*getTrusts() {
        return Template.instance().trustsInfo.get();
    },*/
    getTrustsAddress() {
        return Template.instance().trustsAddress.get();
    },
    getIREOsBids() {
        return ClientProperties.find({ trustee: { $not: null }, bids: { $not: null } }).fetch();
    },
    bidAmount(_bid) {
       return (_bid / 100) + '%';
    }
 });
