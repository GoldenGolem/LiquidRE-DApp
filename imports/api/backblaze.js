// Definition of the trustees collection

import {
    Mongo
} from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const BackblazeInfo = new Mongo.Collection('backblaze_info');

BackblazeInfo.attachSchema(new SimpleSchema({
    downloadUrl: {
        type: String,
        optional: true
    },
    apiUrl: {
        type: String,
        optional: true
    },
    authToken: {
        type: String,
        optional: true
    }
}));

BackblazeInfo.deny({
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

export default BackblazeInfo;