import IREOS from '../../api/ireos/ireos.js';
import Prices from '../../api/prices/prices.js';
import MarketCap from '../../api/market-cap/market-cap.js';
import Tickers from '../../api/tickers/tickers.js';

let timeInterval = 5 * (60 * 1000); // 5 minutes
//let timeInterval = 0.5 * (60 * 1000); // 1 minutes

let updateTickers = Meteor.bindEnvironment((_address) => {
    let pipeline = [{
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
                "volume": {
                    "$sum": 1
                },
                "open": {
                    "$first": "$amount"
                },
                "close": {
                    "$last": "$amount"
                },
                "low": {
                    "$min": "$amount"
                },
                "high": {
                    "$max": "$amount"
                },
                "address": {
                    "$first": "$address"
                }
            }
        },
        {
            $project: {
                "open": "$open",
                "close": "$close",
                "low": "$low",
                "high": "$high",
                "volume": "$volume",
                "address": "$address"
            }
        },
        {
            "$sort": {
                "_id": 1
            }
        }
    ];
    let prices = Prices.aggregate(pipeline);
    prices.forEach(price => {
        Tickers.update({
            address: price.address,
            date: new Date(price._id),
            interval: '1hour'
        }, {
            $set: {
                volume: Math.floor(Math.random() * 5000000) + 1000000, //price.volume,
                open: price.open,
                close: price.close,
                high: price.high,
                low: price.low
            }
        }, {
            upsert: true
        });
    });
});

let recordLRETPrices = Meteor.bindEnvironment(() => {
    let ireos = IREOS.find().fetch();
    let now = new Date();
    ireos.forEach(Meteor.bindEnvironment(ireo => {
        let property = ireo.address;
        let liquidProperty = new web3.eth.Contract(LiquidPropertyABI, property);
        cbWrap(liquidProperty.methods.status().call, Meteor.bindEnvironment(res => {
            let lretStatus = res.valueOf();
            let status = [
                'Bidding', // trustees are bidding on it. it only proceeds to funding when the seller chooses a trustee, and the trustee accepts and sets min/max/start/end/etc
                'Funding', // if funding AND now is between start and end, investors can contribute
                'Withdrawn', // trustee withdrew
                'Trading', // trustee enabled trading after withdrawal
                'Frozen', // trustee has frozen trading
                'Failed',
                'CancelledBySeller', // seller that created it decided to cancel it before choosing a trustee
                'CancelledByTrustee', // trustee decided to cancel it
                'Dissolved' // trustee dissolved trust
            ][res.valueOf()];
            if (['Withdrawn', 'Trading', 'Frozen'].indexOf(status) != -1) {
                cbWrap(liquidProperty.methods.version().call, Meteor.bindEnvironment(res => {
                    cbWrap(liquidRE.methods.converterLogic(res.valueOf()).call, Meteor.bindEnvironment(res => {
                        let converterLogic = new web3.eth.Contract(ConverterLogicABI, res.valueOf());
                        let balance, totalSupply, connectorWeight = 0;
                        cbWrap(converterLogic.methods.getBalance(property).call, Meteor.bindEnvironment(res => {
                            balance = res.valueOf();
                            cbWrap(liquidProperty.methods.totalSupply().call, Meteor.bindEnvironment(res => {
                                totalSupply = res.valueOf();
                                cbWrap(liquidProperty.methods.connectorWeight().call, Meteor.bindEnvironment(res => {
                                    connectorWeight = res.valueOf();
                                    let price = (new BigNumber(balance).div(new BigNumber(totalSupply).times(0.1)));
                                    Prices.insert({
                                        address: property,
                                        amount: price.valueOf(),
                                        createdAt: now
                                    });
                                    let marketCap = (balance / 1e17).toFixed(2);
                                    MarketCap.insert({
                                        address: property,
                                        amount: marketCap.valueOf(),
                                        createdAt: now
                                    });
                                    updateTickers(property);
                                }));
                            }));
                        }), err => {
                            console.log('error', property, 'status', lretStatus)
                        });
                    }));
                }));
            }
        }))
    }));
});

let recordRENTPrices = Meteor.bindEnvironment(() => {
    let now = new Date();
    cbWrap(liquidRE.methods.rentLogic().call, Meteor.bindEnvironment(res => {
        rentLogic = new web3.eth.Contract(RENTLogicABI, res);
        let balance, totalSupply, connectorWeight = 0;
        cbWrap(rentLogic.methods.rent().call, Meteor.bindEnvironment(res => {
            rent = new web3.eth.Contract(RENTABI, res);
            cbWrap(rent.methods.totalSupply().call, Meteor.bindEnvironment(res => {
                totalSupply = web3.utils.fromWei(res.valueOf());
                cbWrap(rent.methods.connectorWeight().call, Meteor.bindEnvironment(res => {
                    connectorWeight = res.valueOf();
                    cbWrap(rentLogic.methods.getBalance().call, Meteor.bindEnvironment(res => {
                        balance = web3.utils.fromWei(res.valueOf());
                        let price = (balance / ((connectorWeight / 1000000) * totalSupply)).toFixed(2);
                        Prices.insert({
                            address: rent.options.address,
                            amount: price.valueOf(),
                            createdAt: now
                        });
                        let marketCap = (balance / (connectorWeight / 1000000)).toFixed(2);
                        MarketCap.insert({
                            address: rent.options.address,
                            amount: marketCap.valueOf(),
                            createdAt: now
                        });
                        updateTickers(rent.options.address);
                    }));
                }));
            }));
        }));
    }));
});

let runRecordPrices = () => {
    setInterval(() => {
        recordLRETPrices();
        recordRENTPrices();
    }, timeInterval);
}

export {
    runRecordPrices
};