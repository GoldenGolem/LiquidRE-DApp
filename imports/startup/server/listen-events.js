import IREOS from '../../api/ireos/ireos.js';
import Notifications from '../../api/notifications/notifications.js';

let startListening = Meteor.bindEnvironment(() => {

    liquidRE_WS.events.NewSeller(Meteor.bindEnvironment((err, res) => {
        if (!err) {
            let address = res.returnValues.seller;
            // update seller status
            Meteor.users.update({
                username: address
            }, {
                $set: {
                    'seller_status': 'Verified'
                }
            });
            // send notification
            let data = {};
            data.description = `Seller application was confirmed`;
            data.category = "Server Side Action";
            data.confirmed = true;
            data.userAddress = address;
            Notifications.insert(data);

            // send email here
        }
    }));

    liquidRE_WS.events.NewTrustee(Meteor.bindEnvironment((err, res) => {
        if (!err) {
            let address = res.returnValues.trustee;
            // update trustee status
            Meteor.users.update({
                username: address
            }, {
                $set: {
                    'trustee_status': 'Verified'
                }
            });
            // send notification
            let data = {};
            data.description = `Trustee application was confirmed`;
            data.category = "Server Side Action";
            data.confirmed = true;
            data.userAddress = address;
            Notifications.insert(data);
            // send email here
        }
    }));

    liquidRE_WS.events.NewInvestor(Meteor.bindEnvironment((err, res) => {
        if (!err) {
            let address = res.returnValues.investor;
            // update investor status
            Meteor.users.update({
                username: address
            }, {
                $set: {
                    'investor_status': 'Verified'
                }
            });
            // send notification
            let data = {};
            data.description = `Investor application was confirmed`;
            data.category = "Server Side Action";
            data.confirmed = true;
            data.userAddress = address;
            Notifications.insert(data);

            // send email here
            let user = Meteor.users.findOne({
                username: address
            });
            if (user) {
                let email = user.emails[0].address;

                Email.send({
                    to: email,
                    from: Meteor.settings.EMAIL_FROM,
                    subject: "Welcome to LiquidRE.io!",
                    html: `<h1>Welcome, ${user.profile.name},</h1>` +
                        `<br><br>` +
                        `Congratulations, we have confirmed your identity and you can now participate on LiquidRE.` +
                        `<br><br>` +
                        `Thanks!` +
                        `<br>` +
                        `The LiquidRE Team` +
                        `<br><br>` +
                        `<a href="http://liquidre.io/lrets">Get Started</a>`
                });
            }

        }
    }));


    // New IREO/Property
    liquidRE_WS.events.NewProperty(Meteor.bindEnvironment((err, res) => {
        if (!err) {
            let address = res.returnValues.property;
            let ireo = IREOS.findOne({address: address});
            if(!ireo) {
                IREOS.insert({address: address});
            }
        }
    }));

    // updates tx notifications
    web3WS.eth.subscribe('logs', {}, Meteor.bindEnvironment((err, res) => {
        if (!err && !res.removed) {
            Notifications.update({
                transactionHash: res.transactionHash
            }, {
                $set: {
                    confirmed: (res.blockNumber) ? true : false
                }
            }, {
                multi: true
            })
        }
    }));

});

export {
    startListening
};