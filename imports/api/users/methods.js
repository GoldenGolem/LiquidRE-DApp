import {
    Meteor
} from 'meteor/meteor';
import Users from './users.js';

Meteor.methods({
    'users.findByEmail'(email) {
        let user = Meteor.users.findOne({"emails.address" : email});
        if(user) return true;
        return false;
    },
    'users.update_profile' (_data) {
        let fields = [
            'profile.name',
            'profile.address1',
            'profile.address2',
            'profile.city',
            'profile.country',
            'profile.postal',
            'profile.category',
            'profile.profileImage',
            'profile.imageID'
        ];

        if (Meteor.user() && Meteor.user().emails && Meteor.user().emails.length > 0)
            delete _data['emails'];
        else
            fields.push('emails');

        let data = {};
        fields.forEach(item => {
            data[item] = _data[item];
        });

        Meteor.users.update({
            _id: Meteor.userId()
        }, {
                $set: data
            })
    },
    'users.verify'(address, field) {
        if (Meteor.userId() && Roles.userIsInRole(Meteor.userId(), ['Admin', 'Manager', 'Verifier'])) {
            if (user) {
                let email = user.emails[0].address;
                EmailManager.sendWelcomeEmail(email, "Your account has been verified", {
                    name: user.profile.name,
                    message: `${user.profile.name} your account has been verified. Please login to your account to view the current status. Your Account ID is ${address}`,
                    actionDetails: {
                        text: "Login",
                        "message": "",
                        link: "http://liquidre.io/login"
                    }
                });
            }
            return Meteor.users.update({
                username: address
            }, {
                    $set: {
                        [field]: 'Verified'
                    }
                });
        } else {
            throw new Meteor.Error('Forbidden', 'Admin access needed.');
        }
    },
    'users.apply'(field) {
        if (Meteor.userId() && (field == 'seller_status' || field == 'investor_status')) {

            let user = Meteor.users.findOne({
                username: address
            });
            if (user) {
                let email = user.emails[0].address;
                EmailManager.sendWelcomeEmail(email, "Please verify your account.", {
                    name: user.profile.name,
                    message: `${user.profile.name} your account has not been verified. Please click the link in this email to verify your account.`,
                    actionDetails: {
                        text: "Verify",
                        "message": "",
                        link: "http://liquidre.io/lrets"
                    }
                });
            }
            return Meteor.users.update({
                _id: Meteor.userId()
            }, {
                    $set: {
                        [field]: 'Pending'
                    }
                });
        } else {
            throw new Meteor.Error('Forbidden', 'User access needed.');
        }
    },
    'users.apply-trustee'(_name, _mailing_address, _signed_document) {
        if (Meteor.userId()) {
            return Meteor.users.update({
                _id: Meteor.userId()
            }, {
                    $set: {
                        'trustee_status': 'Pending',
                        'trustee_application.name': _name,
                        'trustee_application.mailing_address': _mailing_address,
                        'trustee_application.signedAgreement': _signed_document
                    }
                });
        } else {
            throw new Meteor.Error('Forbidden', 'User access needed.');
        }
    }
});