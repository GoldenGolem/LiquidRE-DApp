// Definition of the trustees collection

import {
    Mongo
} from 'meteor/mongo';
import commonSchema from '../common-schema.js';
import SimpleSchema from 'simpl-schema';

const IREOS = new Mongo.Collection('ireos');

let file = new SimpleSchema({
    filename: {
        type: String,
        label: "File Name",
        required: true
    },
    description: {
        type: String,
        label: "Description",
        required: true
    },
    file: {
        type: String,
        label: "File",
        required: true
    },
    filesize: {
        type: Number,
        label: "File Size",
        required: true
    }
});

let video = new SimpleSchema({
    youtube_url: {
        type: String,
        label: "Youtube URL",
        required: true
    },
    description: {
        type: String,
        label: "Description",
        optional: true
    },
    title: {
        type: String,
        label: "Title",
        optional: true
    }
});

let diligence = new SimpleSchema({
    videos: {
        type: Array,
        optional: true
    },
    "videos.$": {
        type: video
    },
    pictures: {
        type: Array,
        optional: true
    },
    "pictures.$": {
        type: file
    },
    documents: {
        type: Array,
        optional: true
    },
    "documents.$": {
        type: file
    }
});

let valuation = new SimpleSchema({
    user_id: {
        type: String,
        label: "User ID",
        required: true
    },
    amount: {
        type: String,
        label: "File Extension",
        required: true
    },
    file: {
        type: String,
        label: "File",
        required: true
    }
});

IREOS.attachSchema(new SimpleSchema({
    ended: {
        type: Boolean,
        defaultValue: false,
        optional: true
    },
    status: {
        type: Array,
        optional: true
    },
    "status.$": {
        type: String,
        allowedValues: ['On-progress', 'Failed', 'Successful'],
    },
    seller: {
        type: String,
        label: "Seller",
        optional: true
    },
    description: {
        type: String,
        label: "Description",
        optional: true
    },
    address: {
        type: String,
        label: "Address",
        required: true,
        index: 1
    },
    youtube_video: {
        type: String,
        label: "Youtube Video URL",
        optional: true
    },
    image: {
        type: String,
        label: "Image",
        optional: true
    },
    valuations: {
        type: Array,
        optional: true
    },
    "valuations.$": {
        type: valuation
    },
    physical: {
        type: diligence,
        optional: true
    },
    financial: {
        type: diligence,
        optional: true
    },
    legal: {
        type: diligence,
        optional: true
    }
}).extend(commonSchema.dates));

IREOS.deny({
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

export default IREOS;