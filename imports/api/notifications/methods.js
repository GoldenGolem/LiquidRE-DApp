import {
    Meteor
} from 'meteor/meteor';
import Notifications from './notifications.js';
import '/imports/api/collections.js';

Meteor.methods({
    'notifications.alertSent' (_id) {
        if(Meteor.userId()) {
            return Notifications.update({
                _id: _id,
                userAddress: Meteor.user().username
            }, {
                $set: {
                    alertSent: true
                }
            });
        }
    },
    'notifications.approveTPEG' (_hash, _propertyAddress, _propertyName, _amount) {
        if(Meteor.userId()) {
            let data = {};
            data.transactionHash = _hash;
            data.propertyAddress = _propertyAddress;
            data.description = `${_amount} TPEG Sent to property "${_propertyName}" was confirmed.`;
            data.category = "Transaction";
            data.userAddress = Meteor.user().username;
            return Notifications.insert(data);
        } else {
            throw new Meteor.Error('Forbidden', 'User access needed.');
        }
    },
    'notifications.buyIREOShares' (_hash, _propertyAddress, _propertyName, _amount) {
        if(Meteor.userId()) {
            let data = {};
            data.transactionHash = _hash;
            data.propertyAddress = _propertyAddress;
            data.description = `Buy ${_amount} shares of property "${_propertyName}" was confirmed.`;
            data.category = "Transaction";
            data.userAddress = Meteor.user().username;
            return Notifications.insert(data);
        } else {
            throw new Meteor.Error('Forbidden', 'User access needed.');
        }
    },
    'notifications.newIREO' (_hash, _name) {
        if(Meteor.userId()) {
            let data = {};
            data.transactionHash = _hash;
            data.description = `New IREO "${_name}" was confirmed.`;
            data.category = "Transaction";
            data.userAddress = Meteor.user().username;
            return Notifications.insert(data);
        } else {
            throw new Meteor.Error('Forbidden', 'User access needed.');
        }
    },
    'notifications.bidIREO' (_hash, _propertyAddress, _propertyName, _amount) {
        if(Meteor.userId()) {
            let data = {};
            data.transactionHash = _hash;
            data.propertyAddress = _propertyAddress;
            data.description = `Your trustee bid to property "${_propertyName}" with ${_amount/100}% was confirmed.`;
            data.category = "Transaction";
            data.userAddress = Meteor.user().username;
            return Notifications.insert(data);
        } else {
            throw new Meteor.Error('Forbidden', 'User access needed.');
        }
    },
    'notifications.selectIREOTrustee' (_hash, _propertyAddress, _propertyName, _bidderAddress) {
        if(Meteor.userId()) {
            let data = {};
            data.transactionHash = _hash;
            data.propertyAddress = _propertyAddress;
            data.description = `Your bid selection for your property "${_propertyName}" was confirmed.`;
            data.category = "Transaction";
            data.userAddress = Meteor.user().username;
            Notifications.insert(data);

            data = {};
            data.transactionHash = _hash;
            data.propertyAddress = _propertyAddress;
            data.description = `You were selected as trustee for property "${_propertyName}"`;
            data.category = "Server Side Action";
            data.userAddress = _bidderAddress;
            Notifications.insert(data);
        } else {
            throw new Meteor.Error('Forbidden', 'User access needed.');
        }
    },
    'notifications.approveIREO' (_hash, _propertyAddress, _propertyName, _sellerAddress) {
        if(Meteor.userId()) {
            let data = {};
            data.transactionHash = _hash;
            data.propertyAddress = _propertyAddress;
            data.description = `Your approval of property "${_propertyName}" was confirmed.`;
            data.category = "Transaction";
            data.userAddress = Meteor.user().username;
            Notifications.insert(data);

            data = {};
            data.transactionHash = _hash;
            data.propertyAddress = _propertyAddress;
            data.description = `Trustee approved your property "${_propertyName}"`;
            data.category = "Server Side Action";
            data.userAddress = _sellerAddress;
            Notifications.insert(data);
        } else {
            throw new Meteor.Error('Forbidden', 'User access needed.');
        }
    },

});