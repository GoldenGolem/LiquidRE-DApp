
import {
    Mongo
} from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const Tickers = new Mongo.Collection('tickers');

Tickers.attachSchema(new SimpleSchema({
    interval: {
        type: String,
        label: "interval",  
        required: true,
        allowedValues: ['5min', '30min', '1hour', 'day', '30days'],
        index: 1
    },
    date: {
        type: Date,
        label: "Date",  
        required: true,
        index: 1
    },
    address: {
        type: String,
        label: "Address",
        required: true,
        index: 1
    },
    volume: {
        type: Number,
        label: "Volume",
        required: true
    },
    open: {
        type: Number,
        label: "Open",
        required: true
    },
    close: {
        type: Number,
        label: "Close",
        required: true
    },
    high: {
        type: Number,
        label: "High",
        required: true
    },
    low: {
        type: Number,
        label: "Low",
        required: true
    }
}));

Tickers.deny({
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

export default Tickers;