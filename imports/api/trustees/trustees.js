// Definition of the trustees collection

import {
    Mongo
} from 'meteor/mongo';
import commonSchema from '../common-schema.js';
import SimpleSchema from 'simpl-schema';

const Trustees = new Mongo.Collection('trustees');

Trustees.attachSchema(new SimpleSchema({
    name: {
        type: String,
        label: "Name",
        required: true
    },
    mailing_address: {
        type: String,
        label: "Mailing Address",
        required: true
    },
    wallet: {
        type: String,
        label: "Wallet Address",
        required: true
    },
    verified: {
        type: Boolean,
        defaultValue: false
    },
    signedAgreement: {
        type: String,
        label: "Signed Agreement Documents",
        required: true
    }
}).extend(commonSchema.dates));

Trustees.deny({
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

export default Trustees;