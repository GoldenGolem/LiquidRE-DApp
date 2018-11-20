import {
    Meteor
} from 'meteor/meteor';
import FAQ from '../faq.js';
import {
    Random
} from 'meteor/random';


Meteor.publish('faq.all', function () {
    return FAQ.find({});
});