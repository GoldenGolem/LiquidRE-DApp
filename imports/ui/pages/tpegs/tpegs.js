import './tpegs.html';

Template.tpegs.onCreated(function() {
    this.allowance = new ReactiveVar(0);
    this.supply = new ReactiveVar(0);
    this.balance = new ReactiveVar(0);
    this.balanceOf = new ReactiveVar(0);
    updateDefaultAccount();
    
    let init = () => {
        if (typeof web3 !== 'undefined' && web3.eth.defaultAccount && stableToken) {
            cbWrap(stableToken.methods.totalSupply().call, res => this.supply.set(res.valueOf()));
            cbWrap(stableToken.methods.balanceOf(web3.eth.defaultAccount).call, res => this.balance.set(res.valueOf()));
        } else {
            setTimeout(init, 1000);
        }
    };
    //init();
});

Template.tpegs.events({
    'submit #check-allowance': (event, template) => {
        let allowance = Template.instance().allowance;
        cbWrap(
            stableToken.methods.allowance(event.target.allowance_from_address.value, event.target.allowance_to_address.value).call, 
            res => allowance.set(res.valueOf())
        );
    },
    'submit #update-allowance': (event, template) => {
        processTx(stableToken.methods.approve(event.target.update_allowance_to_address.value, web3.utils.toWei(event.target.update_allowance_amount.value, 'ether')));
    },
    'submit #send-tpegs': (event, template) => {
        processTx(stableToken.methods.transfer(event.target.send_address.value, web3.utils.toWei(event.target.send_amount.value, 'ether')));
    },
    'submit #get-balance-of': (event, template) => {
        let balanceOf = Template.instance().balanceOf;
        cbWrap(
            stableToken.methods.balanceOf(event.target.of_address.value).call,
            res => balanceOf.set(res.valueOf())
        );
    },
    'submit #issue-tpegs': (event, template) => {
        processTx(stableToken.methods.issue(event.target.issue_address.value, web3.utils.toWei(event.target.issue_amount.value, 'ether')));
    }
});

Template.tpegs.helpers({
    getAllowance() {
        return Template.instance().allowance.get() / 1e18;
    },
    getSupply() {
        return Template.instance().supply.get() / 1e18;
    },
    getBalance() {
        return Template.instance().balance.get() / 1e18;
    },
    getCoinbase() {
        return web3.eth.defaultAccount;
    },
    getBalanceOf() {
        return Template.instance().balanceOf.get() / 1e18;
    }
});
