
import {
    Mongo
} from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const Faq = new Mongo.Collection('faq');

Faq.attachSchema(new SimpleSchema({
    question: {
        type: String,
        label: "Question",
        required: true,
    },
    answer: {
        type: String,
        label: "Answer",
        required: true
    },
    sortorder: {
        type: Number,
        label: "Sortorder",
        required: true,
    },
    createdAt: {
        type: Date,
        label: "Date",  
        required: true,
        defaultValue: new Date()
    }
}));

Faq.deny({
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

export default Faq;