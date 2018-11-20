import './lretsID.html';
import Notifications from '../../../../api/notifications/notifications';
import '../../../stylesheets/property-id.scss';

var loadingMessage = new ReactiveVar("Loading property...");
Template.lretsID.onCreated(function() {
    // updateLRETs();
    // updateTrustees();
    updateDefaultAccount();
    this.myRoles = new ReactiveVar('  '); 
     this.lertHistoryData = new ReactiveVar();
     this.converterHistoryData = new ReactiveVar();
     this.ireoHistoryData = new ReactiveVar();
     this.showHideHistory = new ReactiveVar("Show History");
     this.showHideHistoryContent = new ReactiveVar(false);
    setTimeout(function() {
        loadingMessage.set("Unable to locate property");
    } , 3000);
           
    let checkStatus = () => {
        if (typeof web3 !== 'undefined' && web3.eth.defaultAccount != null && typeof liquidRE !== 'undefined') {
            
            cbWrap(liquidRE.methods.investorInfo(web3.eth.defaultAccount).call, res => {
                if (res[0]) {
                    this.myRoles.set(this.myRoles.get() + 'Investor, ');
                }
            });
        }else {
            setTimeout(checkStatus, 500);
        }
    }; 
    checkStatus();   
});

Template.lretsID.helpers({
    // there's probably a built in for getting _id in spacebars, figure it out and remove this
    id() {
        return Router.current().params._id;
    },
    getLRETinfo() {
        return ClientProperties.findOne({
            address: Router.current().params._id
        });
    },
    loadingMessage() {
        return loadingMessage.get();
    },
    price(lret) {
        return (lret && lret.connectorBalance && lret.totalSupply) ? (new BigNumber(lret.connectorBalance).div(new BigNumber(lret.totalSupply).times(0.1))).toFixed(2) : null;
    },
    marketCap(lret) {
        return (lret && lret.connectorBalance) ? (lret.connectorBalance / 1e17).toFixed(2) : null;
    },
    showLret(lret) {
        return true;
    },
    isTrusteeOwner(lret) {
        if(lret) {
            let trustee = ClientTrustees.findOne({ address: lret.trustee });
            if(trustee)
                return trustee.address == web3.eth.defaultAccount;
            else
                return false;
        } else {
            return false;
        }
    },
    isTrading(status) {
        return status == 'Trading';
    },
    getRole() {  
        return (Template.instance().myRoles.get().slice(0, -2).indexOf("Investor") >= 0);
    },
    getLertHistoryData(){
      return Template.instance().lertHistoryData.get()
    },
    getConverterHistoryData(){
      return Template.instance().converterHistoryData.get()
    }, 
    getireoHistoryData(){
      return Template.instance().ireoHistoryData.get()
    },
    showHideHistory(){
      return Template.instance().showHideHistory.get()
    },
    showHideHistoryContent(){
      return Template.instance().showHideHistoryContent.get()
    },
     loadHistoryData (){
        if (typeof lretLogic !== 'undefined') {

            const lertHistoryData = Template.instance().lertHistoryData;
            const converterHistoryData = Template.instance().converterHistoryData;
            const ireoHistoryData = Template.instance().ireoHistoryData;
            const currentid = Router.current().params._id;
            var lertdata = [];
            lretLogic.getPastEvents('allEvents', {
                fromBlock: 0,
                toBlock: 'latest'
            }, function (error, events) {
            })
            .then(function (events) {
                events.forEach((e) => {
                    if (currentid == e.returnValues.property)
                    lertdata.push({ address: e.transactionHash, event: e.event,blockNumber:e.blockNumber,amount:e.returnValues.amount});
                })
                lertHistoryData.set(lertdata);
            })
            //load converte logic events
            var converterData = [];
            converterLogic.getPastEvents('allEvents', {
                fromBlock: 0,
                toBlock: 'latest'
            }, function (error, events) {
            })
            .then(function (events) {
                events.forEach((e) => {
                    if (currentid == e.returnValues.property)
                    converterData.push({ address: e.transactionHash, event: e.event,blockNumber:e.blockNumber,amount:e.returnValues.amount});
                })                    
                converterHistoryData.set(converterData)
            })
            var ireoData = [];
            ireoLogic.getPastEvents('allEvents', {
                fromBlock: 0,
                toBlock: 'latest'
            }, function (error, events) {
            })
            .then(function (events) {
                events.forEach((e) => {
                    if (currentid == e.returnValues.property)
                    ireoData.push({ address: e.transactionHash, event: e.event,blockNumber:e.blockNumber,amount:e.returnValues.amount});
                })                    
                ireoHistoryData.set(ireoData)
            })
        } else {
            setTimeout(loadHistoryData, 200);
        }
    }
});

Template.lretsID.events({
    'click .btn-send': function(event, template) {
        let val = template.find('#lret-amount-buy-' + Router.current().params._id).value;
        let amount = val * 1e18;
        // console.log(address);
        // console.log(amount);
        // let converterAddress = ClientLRETs.findOne({address: Router.current().params._id}).converter;
        // console.log(converterAddress);
        // processTx(stableToken.methods.approve(converterLogic.address, amount));
        try {
            stableToken.methods.approve(converterLogic.options.address, new BigNumber(amount)).send({from: web3.eth.defaultAccount});
        } catch (err) {
            Bert.alert( 'Amount must have less than 15 significant digits.' , 'danger', 'growl-top-right' );
        }
    },
    'click .btn-buy': function(event, template) {
        // let address = $(event.target).data('address');
        // cbWrap(cb=>liquidRE.LRETtoConverter.call(address, cb), res => {
        //     cbWrap(cb=>LiquidConverterContract.at(res).buy(tpeg.address, amount, 1, cb));
        // });
        
        // cbWrap(cb=>stableToken.approve(converterLogic.address, amount, cb));
        // cbWrap(cb => converterLogic.buy(Router.current().params._id, amount, 1, cb));

        let amount = web3.utils.toWei(template.find(`#lret-amount-buy-${Router.current().params._id}`).value, 'ether');
        
        // stableToken.methods.approve(converterLogic.options.address, amount)
        // .send({from: web3.eth.defaultAccount})
        // .on('transactionHash', hash => {})
        // .on('confirmation', (confirmationNumber, receipt) => {})
        // .on('receipt', receipt => {});

        converterLogic.methods.buy(Router.current().params._id, amount, 1)
        .send({from: web3.eth.defaultAccount})
        .on('transactionHash', hash => {})
        .on('confirmation', (confirmationNumber, receipt) => {})
        .on('receipt', receipt => {});
    },
    'click .btn-sell': function(event, template) {
        // let address = $(event.target).data('address');
        let amount = template.find(`#lret-amount-sell-${Router.current().params._id}`).value * 1e18;
        // cbWrap(cb=>liquidRE.LRETtoConverter.call(address, cb), res => {
        //     cbWrap(cb=>LiquidConverterContract.at(res).sell(tpeg.address, amount, 1, cb));
        // });
        try {
            processTx(converterLogic.methods.sell(Router.current().params._id, new BigNumber(amount), 1));
        } catch (err) {
            Bert.alert( 'Amount must have less than 15 significant digits.' , 'danger', 'growl-top-right' );
        }
    },
    'click .btn-enable-conversion': function(event, template) {
        processTx(lretLogic.methods.toggleTransfers(Router.current().params._id, true));
    },
    'click .btn-disable-conversion': function(event, template) {
        processTx(lretLogic.methods.toggleTransfers(Router.current().params._id, false));
    },
    'click .btn-calc': function(event, template) {
        let tpegs, lrets = null;

        let lretInput = template.find(`#lret-amount-calc-${Router.current().params._id}`);
        let tpegInput = template.find(`#tpeg-amount-calc-${Router.current().params._id}`)

        if(tpegInput.value)
            tpegs = web3.utils.toWei(tpegInput.value, 'ether');
        if(lretInput.value)
            lrets = web3.utils.toWei(lretInput.value, 'ether');

        if (tpegs) {
            // cbWrap(cb=>liquidConverter.getReturn.call(tpeg.address, Router.current().params._id, tpegs, cb), res => lretInput.value = res.valueOf() / 1e18);
            cbWrap(converterLogic.methods.getPurchaseReturn(Router.current().params._id, tpegs).call, res => lretInput.value = web3.utils.fromWei(res.valueOf(), 'ether'));
        } else if (lrets) {
            // cbWrap(cb=>liquidConverter.getReturn.call(Router.current().params._id, tpeg.address, lrets, cb), res => tpegInput.value = res.valueOf() / 1e18);
            cbWrap(converterLogic.methods.getSaleReturn(Router.current().params._id, lrets).call, res => tpegInput.value = web3.utils.fromWei(res.valueOf(), 'ether'));
        }
    },
    'click .btn-approve-dividends': function(event, template) {
        // let address = Router.current().params._id;
        // let converterAddress = ClientLRETs.findOne({address: Router.current().params._id}).converter;
        let dividends = template.find('#dividends-amount').value * 1e18;
        // txWrap(cb=>tpeg.approve(converterAddress, dividends, cb), updateLRETs);
        // cbWrap(cb=>tpeg.approve(converterAddress, dividends, cb));
        
        processTx(stableToken.methods.approve(converterLogic.options.address, new BigNumber(dividends)));
    },
    'click .btn-deposit-dividends': function(event, template) {
        // let address = Router.current().params._id;
        let dividends = template.find('#dividends-amount').value * 1e18;
        // let converterAddress = ClientLRETs.findOne({address: Router.current().params._id}).converter;
        // let liquidConverter = LiquidConverterContract.at(converterAddress);
        // cbWrap(cb=>liquidConverter.depositDividends(tpeg.address, dividends, cb));
        
        // cbWrap(cb => stableToken.approve(converterLogic.address, dividends, cb));
        // cbWrap(cb => converterLogic.depositDividends(Router.current().params._id, dividends, cb));
        
        // stableToken.methods.approve(converterLogic.options.address, dividends)
        // .send({from: web3.eth.defaultAccount})
        // .on('transactionHash', hash => {})
        // .on('confirmation', (confirmationNumber, receipt) => {})
        // .on('receipt', receipt => {});

        converterLogic.methods.depositDividends(Router.current().params._id, new BigNumber(dividends))
        .send({from: web3.eth.defaultAccount})
        .on('transactionHash', hash => {})
        .on('confirmation', (confirmationNumber, receipt) => {})
        .on('receipt', receipt => {});
    },
    // 'click .force-mine-block': function(event, template) {
    //     console.log('mined');
    //     cbWrap(cb=>web3.currentProvider.sendAsync({
    //         jsonrpc: '2.0',
    //         method: 'evm_mine'
    //     }, cb));
    // }
    'click .btn-request-withdrawal': function(event, template) {
        // let address = Router.current().params._id;
        let withdrawal = template.find('#withdrawal-amount').value * 1e18;
        // let converterAddress = ClientLRETs.findOne({address: Router.current().params._id}).converter;
        // let liquidConverter = LiquidConverterContract.at(converterAddress);
        // cbWrap(cb=>liquidConverter.requestWithdrawal(withdrawal, cb));

        processTx(converterLogic.methods.requestWithdrawal(Router.current().params._id, new BigNumber(withdrawal)));
    },
    'click .btn-withdraw': function(event, template) {
        // let address = Router.current().params._id;
        // let withdrawal = template.find('#withdrawal-amount').value * 1e18;
        // let converterAddress = ClientLRETs.findOne({address: Router.current().params._id}).converter;
        // let liquidConverter = LiquidConverterContract.at(converterAddress);
        // cbWrap(cb=>liquidConverter.withdraw(tpeg.address, cb));
        
        processTx(converterLogic.methods.withdraw(Router.current().params._id));
    },
    'click #showHideHistory':(event, template)=>{
        if(Template.instance().showHideHistoryContent.get()){
            Template.instance().showHideHistory.set("Show History")
            Template.instance().showHideHistoryContent.set(false)
        }
        else
        {
            Template.instance().showHideHistory.set("Hide History")
            Template.instance().showHideHistoryContent.set(true)
        }
        
    }
});
