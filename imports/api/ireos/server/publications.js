
import {
    Meteor
} from 'meteor/meteor';
import IREOS from '../ireos.js';

Meteor.publish('ireos.info', (address) => {
    return IREOS.find({address: address});
});

Meteor.publish('ireos.seller', (seller) => {
    return IREOS.find({seller: seller, seller:{$ne:null}});
});