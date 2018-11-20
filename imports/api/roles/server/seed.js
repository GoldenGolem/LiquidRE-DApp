import {
    Meteor
} from 'meteor/meteor';

let roles = Meteor.roles.find({}).fetch();

if(roles.length == 0) {
    [
        'Admin',
        'Manager',
        'Verifier',
        'Member',
        'Seller',
        'Trustee',
        'Investor'
    ].forEach((item)=> {
        Meteor.roles.insert({name: item});
    })
}