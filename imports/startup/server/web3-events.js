var Web3 = require('web3');

import { runRoleUpdates } from './update-roles.js';
import { startListening } from './listen-events.js';
import { runRecordPrices } from './record-prices.js';
import { runIREOUpdates } from './update-ireos.js';

Meteor.startup(() => {
    web3 = new Web3(Meteor.settings.public.provider);
    web3WS = new Web3(Meteor.settings.public.providerWS);
    let liquidREPointerAddress = LiquidREPointer;
    web3.eth.net.getId((err, netId) => {
        switch (netId) {
            case 1:
                break;
            case 3:
                liquidREPointerAddress = LiquidREPointerRopsten;
                break;
            default:
                liquidREPointerAddress = LiquidREPointerDevelopment;
        }
        liquidREPointer = new web3.eth.Contract(LiquidREPointerABI, liquidREPointerAddress);

        cbWrap(liquidREPointer.methods.liquidRE().call, res => {
            liquidRE = new web3.eth.Contract(LiquidREABI, res);
            liquidRE_WS = new web3WS.eth.Contract(LiquidREABI, res);
            runRoleUpdates();
            runRecordPrices();
            startListening();
            runIREOUpdates();
        });
    });

});