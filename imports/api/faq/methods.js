import {
    Meteor
} from 'meteor/meteor';
import FAQ from './faq.js';

Meteor.methods({
    'faq.add_qa' (_question, _answer, _sortorder) {
        let data = {};
        data.question = _question;
        data.answer = _answer;
        data.sortorder = _sortorder;
        FAQ.insert(data);
    },
    'faq.remove_qa' (_id) {
        let data = {};
        data._id = _id;
        FAQ.remove(data);
    },
});