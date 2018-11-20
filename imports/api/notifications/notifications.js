import {
    Mongo
} from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const Notifications = new Mongo.Collection('notifications');

Notifications.attachSchema(new SimpleSchema({
    category: {
        type: String,
        allowedValues: ['Transaction', 'Server Side Action'],
        label: "Category",
        defaultValue: 'Transaction',
        required: true
    },
    transactionHash: {
        type: String,
        label: "Transaction Hash",
        optional: true
    },
    userAddress: {
        type: String,
        label: "User Address",
        required: true
    },
    propertyAddress: {
        type: String,
        label: "Property Address",
        optional: true
    },
    description: {
        type: String,
        label: "Description",
        required: true
    },
    viewed: {
        type: Boolean,
        defaultValue: false
    },
    confirmed: {
        type: Boolean,
        defaultValue: false
    },
    alertSent: {
        type: Boolean,
        defaultValue: false
    },
    createdAt: {
        type: Date,
        label: "Date",
        defaultValue: new Date()
    }
}));

Notifications.deny({
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

export default Notifications;