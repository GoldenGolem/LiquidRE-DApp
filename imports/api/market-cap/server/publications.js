import {
    Meteor
} from 'meteor/meteor';
import MarketCap from '../market-cap.js';
import {
    Random
} from 'meteor/random';

Meteor.publish('marketcap.hourly-ticker', function (_address) {
    let self = this;
    ReactiveAggregate(this, MarketCap, [{
            "$match": {
                "address": _address
            },
        },
        {
            "$group": {
                "_id": {
                    $dateToString: {
                        format: "%Y-%m-%dT%H:00:00Z",
                        date: "$createdAt"
                    }
                },
                "close": {
                    "$last": "$amount"
                }
            }
        },
        {
            $project: {
                "close": "$close"
            }
        },
        {
            "$sort": {
                "_id": 1
            }
        }
    ])
});

Meteor.publish('marketcap.all', function () {
    return MarketCap.find({});
});