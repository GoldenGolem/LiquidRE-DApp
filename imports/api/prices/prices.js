
import {
    Mongo
} from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const Prices = new Mongo.Collection('prices');

Prices.attachSchema(new SimpleSchema({
    address: {
        type: String,
        label: "Address",
        required: true,
        index: 1
    },
    amount: {
        type: Number,
        label: "Amount",
        required: true
    },
    createdAt: {
        type: Date,
        label: "Date",  
        required: true,
        defaultValue: new Date()
    }
}));

Prices.deny({
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

export default Prices;