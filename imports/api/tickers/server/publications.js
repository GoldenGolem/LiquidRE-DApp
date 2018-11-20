
import {
    Meteor
} from 'meteor/meteor';
import Tickers from '../tickers.js';

Meteor.publish('tickers.all', () => {
    return Tickers.find({});
});