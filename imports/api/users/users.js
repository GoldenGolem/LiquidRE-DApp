// Definition of the users collection

import {
    Mongo
} from 'meteor/mongo';

import commonSchema from '../common-schema.js';
import SimpleSchema from 'simpl-schema';

Users = Meteor.users;

let profileSchema = new SimpleSchema({
    name: {
        type: String,
        label: "Name",
        optional: true
    },
    address1: {
        type: String,
        label: "Address 1",
        optional: true
    },
    address2: {
        type: String,
        label: "Address 2",
        optional: true
    },
    city: {
        type: String,
        label: "City",
        optional: true
    },
    postal: {
        type: String,
        label: "Postal",
        optional: true
    },
    country: {
        type: String,
        label: "Country",
        optional: true
    },
    profileImage: {
        type: String,
        label: "Profile Picture",
        optional: true
    },
    imageID: {
        type: String,
        label: "ID Document",
        optional: true
    },
    investor: {
        type: Boolean,
        label: "Investor Status",
        required: true,
        defaultValue: false,
    },
    category: {
        type: SimpleSchema.Integer,
        label: "Category",
        required: true,
    },
});

let trusteeDetailsSchema = new SimpleSchema({
    name: {
        type: String,
        label: "Name",
        optional: true
    },
    mailing_address: {
        type: String,
        label: "Mailing Address",
        required: true
    },
    signedAgreement: {
        type: String,
        label: "Signed Agreement Documents",
        required: true
    }
});

Users.attachSchema(new SimpleSchema({
    username: {
        type: String,
        required: true
    },
    emails: {
        type: Array,
        optional: true
    },
    "emails.$": {
        type: Object
    },
    "emails.$.address": {
        type: String,
        regEx: SimpleSchema.RegEx.Email
    },
    "emails.$.verified": {
        type: Boolean,
        defaultValue: false
    },
    profile: {
        type: profileSchema,
        optional: true
    },
    services: {
        type: Object,
        optional: true,
        blackbox: true
    },
    roles: {
        type: Array,
        optional: true,
        blackbox: true
    },
    "roles.$": {
        type: String
    },
    verified: {
        type: Boolean,
        defaultValue: false
    },
    seller_status: {
        type: String,
        defaultValue: 'Not Applied'
    },
    trustee_status: {
        type: String,
        defaultValue: 'Not Applied'
    },
    investor_status: {
        type: String,
        defaultValue: 'Not Applied'
    },
    trustee_application: {
        type: trusteeDetailsSchema,
        optional: true
    }
}).extend(commonSchema.dates));

Users.deny({
    insert: function () {
        return true;
    },
    update: function () {
        return true;
    },
    remove: function () {
        return true;
    }
});

export default Users;