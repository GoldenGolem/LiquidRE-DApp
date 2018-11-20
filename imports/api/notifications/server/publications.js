import {
  Meteor
} from 'meteor/meteor';
import Notifications from '../notifications';

Meteor.publish('notifications.all', function () {
  if (Meteor.userId()) {
    return Notifications.find({
      userAddress: Meteor.user().username,
      confirmed: true
    }, {
      sort: {
        createdAt: -1,
        viewed: -1
      }
    });
  } else {
    return [];
  }
});

Meteor.publish('notifications.unseen', function () {
  if (Meteor.userId()) {
    return Notifications.find({
      userAddress: Meteor.user().username,
      viewed: false,
      confirmed: true
    }, {
      sort: {
        createdAt: -1
      }
    })
  } else {
    return [];
  }
});