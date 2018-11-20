// All trustees-related publications

import {
  Meteor
} from 'meteor/meteor';
import Trustees from '../trustees.js';

Meteor.publish('trustees.info', function (address) {
  return Trustees.find({
    wallet: address
  });
});

Meteor.publish('trustees.all', function () {
  return Trustees.find();
});

Meteor.publish('trustees.verified', function () {
  return Trustees.find({verified: true});
});