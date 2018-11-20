// All entities-related publications

import { Meteor } from 'meteor/meteor';
import { Entities } from '../entities.js';


Meteor.publish('comments.all', function (obj, refID) {
  return Comments.find({obj: obj, refID: refID});
});
