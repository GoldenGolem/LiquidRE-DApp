import {
    Meteor
} from 'meteor/meteor';
import Users from '../users.js';

Meteor.publish('users.all', () => {
    if (Meteor.userId() && Roles.userIsInRole(Meteor.userId(), ['Admin', 'Manager', 'Verifier'])) {
        return Meteor.users.find();
    } else {
        return [];
    }
});

Meteor.publish('users.seller-applicants', () => {
    if (Meteor.userId() && Roles.userIsInRole(Meteor.userId(), ['Admin', 'Manager', 'Verifier'])) {
        return Meteor.users.find({seller_status: 'Pending'});
    } else {
        return [];
    }
});

Meteor.publish('users.trustee-applicants', () => {
    if (Meteor.userId() && Roles.userIsInRole(Meteor.userId(), ['Admin', 'Manager', 'Verifier'])) {
        return Meteor.users.find({trustee_status: 'Pending'});
    } else {
        return [];
    }
});

Meteor.publish('users.investor-applicants', () => {
    if (Meteor.userId() && Roles.userIsInRole(Meteor.userId(), ['Admin', 'Manager', 'Verifier'])) {
        return Meteor.users.find({investor_status: 'Pending'});
    } else {
        return [];
    }
});

Meteor.publish('users.profile', (address) => {
    return Meteor.users.find({username: address}, {
        'profile': 1
    });
});

Meteor.publish('users.application-status', () => {
    return Meteor.users.find({_id: Meteor.userId()}, {
        'seller_status': 1,
        'trustee_status': 1,
        'investor_status': 1
    });
});