import "./networkerror.html";
Template.networkerror.onCreated(function () {
    if (Meteor.settings.public.ethNetwork == web3.version.network) {
        Router.go("/");
    }
});

Template.networkerror.helpers({
    networkToName(id) {
        switch (id) {
            case 1:
                return "Ethereum Mainnet";
                break;
            case 3:
                return "Ropsten Testnet";
                break;
            case 4:
                return "Rinkeby Testnet";
                break;
            case 42:
                return "Kovan Testnet";
                break;
            default:
                return "Unknown Network";
                break;
        }
    },
    deployNetwork() {
        return Meteor.settings.public.ethNetwork;
    },
    currentNetwork() {
        return parseInt(web3.version.network, 10);
    }
});