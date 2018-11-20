import './portfolio.html';
import '../../stylesheets/portfolio.scss';

Template.portfolio.onCreated(function () {
    // this.ethBalance = new ReactiveVar(0);
    // this.allowance = new ReactiveVar(0);
    // this.supply = new ReactiveVar(0);
    // this.balance = new ReactiveVar(0);
    // this.balanceOf = new ReactiveVar(0);
    // if (typeof web3 !== 'undefined' && web3.eth.coinbase) {
    //     cbWrap(cb=>web3.eth.getBalance(web3.eth.defaultAccount, cb),res => this.ethBalance.set(res.valueOf()));
    //     cbWrap(cb=>tpeg.totalSupply.call(cb), res => this.supply.set(res.valueOf()));
    //     cbWrap(cb=>tpeg.balanceOf.call(web3.eth.defaultAccount, cb), res => this.balance.set(res.valueOf()));
    // }
    // updateLRETs();
    if (redirectingToLogin()) return;
    updateDefaultAccount();
});

Template.portfolio.helpers({
    ethBalance() {
        return Template.instance().ethBalance.get();
    },
    showIssueButton() {
        return Template.instance().balance.get() < 1e25;
    },
    price(lret) {
        return (new BigNumber(lret.connectorBalance).div(new BigNumber(lret.totalSupply).times(0.1))).toFixed(2);
    },
    marketCap(lret) {
        return (lret.connectorBalance / 1e17).toFixed(2);
    },
    showLret(lret) {
        return lret.balance > 0;
    },
    percentOfSupply(lret) {
        return (100 * lret.balance / lret.totalSupply).toFixed(2);
    },
    position(lret) {
        return (new BigNumber(lret.connectorBalance).div(new BigNumber(lret.totalSupply).times(0.1))).times(lret.balance).toFixed(2);
    }
});

Template.portfolio.events({
    'click #tpeg-faucet': (event, template) => {
        if (typeof web3.eth.defaultAccount !== 'undefined') {
            // cbWrap(cb => stableToken.issue(web3.eth.defaultAccount, 1e25, cb));

            stableToken.methods.issue(web3.eth.defaultAccount, 1e25)
                .send({
                    from: web3.eth.defaultAccount
                })
                .on('transactionHash', hash => {})
                .on('confirmation', (confirmationNumber, receipt) => {})
                .on('receipt', receipt => {});
        }
    }
});