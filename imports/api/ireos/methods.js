import {
    Meteor
} from 'meteor/meteor';
import IREOS from './ireos.js';

Meteor.methods({
    'ireos.update'(_address, _data) {




        if (_address) {
           
            IREOS.update({
               address: _address
            }, {
                    $set: _data
                }, {
                    upsert: true
                });
            
        }
    },

    'ireos.add_status' (_address, _status) {
        if(_address) {
            IREOS.update({
                address: _address
            }, {
                $push: {
                    ['status']: _status
                }
            }, {
                upsert: true
            });
        }
    },

    'ireos.add_file'(_address, _field, _file) {
        if (_address) {

            IREOS.update({
                address: _address
            }, {
                    $push: {
                        [_field]: _file
                    }
                }, {
                    upsert: true
                });
        }
    },
});