import {
    Meteor
} from 'meteor/meteor';
import {
    Template
} from 'meteor/templating';
import {
    ReactiveVar
} from 'meteor/reactive-var';
import {
    Mongo
} from 'meteor/mongo';
import {
    moment
} from "meteor/momentjs:moment";
import {
    PersistentMinimongo2
} from 'meteor/frozeman:persistent-minimongo2';

var Web3 = require('web3');

import '/imports/api/collections.js';
import '/imports/api/clientMethods.js';
import '/imports/api/helpers.js';

import '/imports/ui/stylesheets/index.js';

document.title = 'LiquidRE';

window.addEventListener('load', function () {
    let ethNetwork = Meteor.settings.public.ethNetwork;
    currentNetwork = null;
    if (typeof web3 !== 'undefined') {
        web3 = new Web3(web3.currentProvider);
        web3.eth.net.getId((err, netId) => {
            currentNetwork = netId;
            localStorage.setItem("currentNetwork", currentNetwork);
            if (ethNetwork > 0) { // 0 means custom network in settings.json
                if (ethNetwork != currentNetwork) {
                    Meteor.logout(() => {
                        Router.go('/networkerror');
                    });
                }
            }
            if (web3.currentProvider.isMetaMask) {
                web3.eth.getCoinbase((err, account) => {
                    web3.eth.defaultAccount = account;
                });
            }
        });
    } else {
        web3 = new Web3(new Web3.providers.HttpProvider(Meteor.settings.public.provider));
    }

    var init = () => {
        if (currentNetwork != null && web3.eth.defaultAccount != null) {
            let liquidREPointerAddress = LiquidREPointer;
            switch (currentNetwork) {
                case 1:
                    break;
                case 3:
                    liquidREPointerAddress = LiquidREPointerRopsten;
                    break;
                default:
                    liquidREPointerAddress = LiquidREPointerDevelopment;
            }
            //lowerUpper = deployed instance of contract, calls and transactions can be made directly on it
            liquidREPointer = new web3.eth.Contract(LiquidREPointerABI, liquidREPointerAddress);
            //UppercaseContract = contract object without .at(address) to be reused with different addresses
            LiquidPropertyContract = new web3.eth.Contract(LiquidPropertyABI);


            cbWrap(liquidREPointer.methods.liquidRE().call, res => {
                liquidRE = new web3.eth.Contract(LiquidREABI, res);
                cbWrap(liquidRE.methods.lretLogic(0).call, res => {
                    lretLogic = new web3.eth.Contract(LRETLogicABI, res);
                });
                cbWrap(liquidRE.methods.ireoLogic(0).call, res => {
                    ireoLogic = new web3.eth.Contract(IREOLogicABI, res);
                });
                cbWrap(liquidRE.methods.converterLogic(0).call, res => {
                    converterLogic = new web3.eth.Contract(ConverterLogicABI, res);
                    initializePropertiesConverter();
                });
                cbWrap(liquidRE.methods.liquidFactory().call, res => {
                    liquidFactory = new web3.eth.Contract(LiquidFactoryABI, res);
                });
                cbWrap(liquidRE.methods.stableToken().call, res => {
                    stableToken = new web3.eth.Contract(TPEGABI, res);
                    initializeStableToken();
                });
                cbWrap(liquidRE.methods.rentLogic().call, res => {
                    rentLogic = new web3.eth.Contract(RENTLogicABI, res);
                    cbWrap(rentLogic.methods.rent().call, res => {
                        rent = new web3.eth.Contract(RENTABI, res);
                        initializeRENT();
                    });
                });
                initializeProperties();
                initializeTrustees();
                initializeSellers();
                initializeInvestors();
                initializeAdministrators();
                initializeManagers();
                initializeVerifiers();
            });
            setTimeout(checkAccounts, 500);
        } else {
            setTimeout(init, 500);
        }
    };

    setTimeout(init, 500);

    // web3.eth.filter('latest', (err, res) => {
    //     // console.log('sdf');
    //     // if (ClientLRETs.findOne({ address: Router.current().params._id})) {
    //     //     updateMarketCap(Router.current().params._id);
    //     // }
    //     updateIREOs();
    //     updateLRETs();
    //     updateTrustees();
    // });

    var checkAccounts = () => {
        web3.eth.getCoinbase((err, account) => {
            if ((account && account.toLowerCase()) != (web3.eth.defaultAccount && web3.eth.defaultAccount.toLowerCase())) {
                Meteor.logout(() => {
                    document.location.reload(true);
                });
            } else {
                setTimeout(checkAccounts, 500);
            }
        });
    };
    if (!web3 || (web3 && !web3.currentProvider.isMetaMask)) {
        Router.go("entities/register");
    }
});