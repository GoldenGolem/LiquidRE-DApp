import {
    Meteor
} from 'meteor/meteor';
import Prices from '../prices.js';
import {
    Random
} from 'meteor/random';


Meteor.publish('prices.all', function () {
    return Prices.find({});
});