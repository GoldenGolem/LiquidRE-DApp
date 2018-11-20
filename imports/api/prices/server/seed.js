import {
    Meteor
} from 'meteor/meteor';
import Prices from '../prices.js';

Prices.remove({});

let now = new Date();

let getTimeAfter5Mins = (_date) => {
    let timeAfter5Mins = new Date(_date);
    timeAfter5Mins = new Date(timeAfter5Mins.setMinutes(timeAfter5Mins.getMinutes() + 5));
    return timeAfter5Mins;
};

for(let i = 0; i < 10000; i++) {
    now = getTimeAfter5Mins(now);
    let price = (Math.random() * 25.0) + 1.0;
    Prices.insert({
        address: 'address1',
        amount: price,
        createdAt: now
    });

    price = (Math.random() * 25.0) + 1.0;
    Prices.insert({
        address: 'address2',
        amount: price,
        createdAt: now
    });
}