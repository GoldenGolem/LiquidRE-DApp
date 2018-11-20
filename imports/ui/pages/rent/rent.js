import './rent.html';
import {
    CLIENT_RENEG_LIMIT
} from 'tls';

Template.rent.onCreated(function () {
    updateDefaultAccount();
    setTimeout(function () {
        checkStatus();
    }, 3000);
    this.myRoles = new ReactiveVar('  ');
    this.exchangeFrom = new ReactiveVar("USD/PEG");
    this.exchangeTo = new ReactiveVar("RENT TOKEN");
    let checkStatus = () => {
        if (typeof web3 !== 'undefined' && web3.eth.defaultAccount != null) {
            if (typeof liquidRE !== 'undefined') {
                cbWrap(liquidRE.methods.investorInfo(web3.eth.defaultAccount).call, res => {
                    if (res[0]) {
                        this.myRoles.set(this.myRoles.get() + 'Investor, ');
                    }
                });
            }
        }
    };
});

Template.rent.helpers({
    address() {
        let clientRENT = ClientRENT.findOne({});
        return clientRENT ? clientRENT.address : null;
    },
    getRENTBalance() {
        let clientRENT = ClientRENT.findOne({});
        return clientRENT ? clientRENT.myBalance : 0;
    },
    getRENTSupply() {
        let clientRENT = ClientRENT.findOne({});
        return clientRENT ? clientRENT.totalSupply : 0;
    },
    getRENTWeight() {
        let clientRENT = ClientRENT.findOne({});
        return clientRENT ? clientRENT.weight : 0;
    },
    getConnectorBalance() {
        let clientRENT = ClientRENT.findOne({});
        return clientRENT ? clientRENT.connectorBalance : 0;
    },
    getPrice() {
        let clientRENT = ClientRENT.findOne({});
        return clientRENT ? (clientRENT.connectorBalance / ((clientRENT.weight / 1000000) * clientRENT.totalSupply)) : 0;
    },
    getRole() {
        return (Template.instance().myRoles.get().slice(0, -2).indexOf("Investor") < 0);
    },
    getExchangeFrom() {
        return Template.instance().exchangeFrom.get();
    },
    getExchangeTo() {
        return Template.instance().exchangeTo.get();
    }
});

Template.rent.events({
    // 'click .btn-approve': function (event, template) {
    //     // toggleModal('show');
    //     processTx(stableToken.methods.approve(rentLogic.options.address, template.find('#tpeg-amount').value * 1e18));
    // },
    'click #buySellConvertButton': function (event, template) {
        if (template.exchangeFrom.get() == "USD/PEG") {
            let usdPegAmountValue = template.find('#from-amount').value;
            processTx(stableToken.methods.approve(rentLogic.options.address, (usdPegAmountValue * 1e18)), function () {
                    processTx(rentLogic.methods.buy((usdPegAmountValue * 1e18), 1), null, "Approve transaction to buy RENT (2/2)");
                },
                "Approve transaction to buy RENT (1/2)")
        } else {
            let rentAmountValue = template.find('#from-amount').value;
            processTx(rentLogic.methods.sell(rentAmountValue * 1e18, 1));
        }

    },
    // 'submit #frm-sell': function (event, template) {
    //     event.preventDefault();
    //     // toggleModal('show');
    //     processTx(rent.methods.sell(event.target.amount.value * 1e18, 1));
    // },
    'click #exchangeValue': function (event, template) {
        event.preventDefault();
        if (template.exchangeFrom.get() == "USD/PEG") {
            template.exchangeFrom.set("RENT TOKEN");
            template.exchangeTo.set("USD/PEG");
            let usdPegAmountValue = template.find('#to-amount').value;
            let rentAmountValue = template.find('#from-amount').value;
        } else {
            template.exchangeTo.set("RENT TOKEN");
            template.exchangeFrom.set("USD/PEG");
            let usdPegAmountValue = template.find('#from-amount').value;
            let rentAmountValue = template.find('#to-amount').value;
        }
    },
    'change #from-amount, keyup #from-amount': function (event, template) {
        event.preventDefault();
        let fromAmountValue = template.find('#from-amount').value;
        if (template.exchangeFrom.get() == "USD/PEG") {
            cbWrap(rentLogic.methods.getPurchaseReturn(fromAmountValue * 1e18).call, res => {
                template.find('#to-amount').value = res.valueOf() / 1e18;
            });
        } else {
            cbWrap(rentLogic.methods.getSaleReturn(fromAmountValue * 1e18).call, res => {
                template.find('#to-amount').value = res.valueOf() / 1e18;
            });
        }
    },
    'change #to-amount, keyup #to-amount': function (event, template) {
        event.preventDefault();
        let toAmountValue = template.find('#to-amount').value;
        if (template.exchangeTo.get() == "USD/PEG") {
            cbWrap(rentLogic.methods.getPurchaseReturn(toAmountValue * 1e18).call, res => {
                template.find('#from-amount').value = res.valueOf() / 1e18;
            });
        } else {
            cbWrap(rentLogic.methods.getSaleReturn(toAmountValue * 1e18).call, res => {
                template.find('#from-amount').value = res.valueOf() / 1e18;
            });
        }
    }
});