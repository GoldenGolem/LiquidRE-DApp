import './lrets.html';
import '../../stylesheets/lrets-list.scss';

Template.lrets.onCreated(function() {
    // updateLRETs();
    // updateTrustees();
    updateDefaultAccount();
});

Template.lrets.helpers({
    price(lret) {
        if(lret && lret.connectorBalance && lret.totalSupply)
            return (new BigNumber(lret.connectorBalance).div(new BigNumber(lret.totalSupply).times(0.1))).toFixed(2);
        else
            return 0;
    },
    marketCap(lret) {
        if(lret && lret.connectorBalance)
            return (lret.connectorBalance / 1e17).toFixed(2);
        else
            return 0;
    },
    showLret(lret) {
        return true;
        //return ['address', 'totalSupply', 'connectorBalance', 'trustee'].every(key => {return key in lret;});
    },
    isTrusteeOwner(lret) {
        let clientTrustee = ClientTrustees.findOne({ address: lret.trustee });
        if(clientTrustee && clientTrustee.owner)
            return clientTrustee.owner == web3.eth.defaultAccount;
        else
            return null;
    },
    getLRETs() {
        return ClientProperties.find({ status: { $in: ['Trading', 'Frozen', 'Withdrawn']}});
    }
});

// Template.lrets.events({
//     'click .btn-send': function(event, template) {
//         let address = $(event.target).data('address');
//         let amount = template.find(`#lret-amount-buy-${address}`).value * 1e18;
//         cbWrap(cb=>liquidRE.LRETtoConverter.call(address, cb), res => {
//             cbWrap(cb=>tpeg.approve(res, amount, cb));
//         });
//     },
//     'click .btn-buy': function(event, template) {
//         let address = $(event.target).data('address');
//         let amount = template.find(`#lret-amount-buy-${address}`).value * 1e18;
//         cbWrap(cb=>liquidRE.LRETtoConverter.call(address, cb), res => {
//             cbWrap(cb=>LiquidConverterContract.at(res).buy(tpeg.address, amount, 1, cb));
//         });
//     },
//     'click .btn-sell': function(event, template) {
//         let address = $(event.target).data('address');
//         let amount = template.find(`#lret-amount-sell-${address}`).value * 1e18;
//         cbWrap(cb=>liquidRE.LRETtoConverter.call(address, cb), res => {
//             cbWrap(cb=>LiquidConverterContract.at(res).sell(tpeg.address, amount, 1, cb));
//         });
//     },
//     'click .btn-enable-conversion': function(event, template) {
//         let address = $(event.target).data('address');
//         cbWrap(cb=>liquidRE.LRETtoConverter.call(address, cb), res => {
//             cbWrap(cb=>LiquidConverterContract.at(res).trusteeToggleConversions(false, cb));
//         });
//     },
//     'click .btn-disable-conversion': function(event, template) {
//         let address = $(event.target).data('address');
//         cbWrap(cb=>liquidRE.LRETtoConverter.call(address, cb), res => {
//             cbWrap(cb=>LiquidConverterContract.at(res).trusteeToggleConversions(true, cb));
//         });
//     }
// });
