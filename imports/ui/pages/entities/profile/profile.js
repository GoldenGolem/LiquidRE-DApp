import './profile.html';
import '../../../stylesheets/register-entities.scss';
import Files from '../../../../api/files.collection.js';
import {
    Meteor
} from 'meteor/meteor';

Template.entitiesProfile.onCreated(function () {
    this.currentProfileUpload = new ReactiveVar(false);
    this.currentUpload = new ReactiveVar(false);
    this.profileImage = new ReactiveVar(null);
    this.profileImageFileId = new ReactiveVar(null);
    this.imageIDFileId = new ReactiveVar(null);
    this.imageID = new ReactiveVar(null);
    this.emailInUse = new ReactiveVar(false);

    var self = this;
    console.log(Router.current());
    console.log(Router.current().params);
    console.log(Router.current().params.id);
    
    this.doUpload = (event, file, source) => {
        let meta = {};
        if (source == 'id')
            meta.bucket = 'identification';
        else
            meta.bucket = 'files'

        var uploadInstance = Files.insert({
            meta: meta,
            file: file,
            streams: 'dynamic',
            chunkSize: 'dynamic'
        }, false);

        uploadInstance.on('start', function () {
            if (source == 'profile')
                self.currentProfileUpload.set(this);
            if (source == 'id')
                self.currentUpload.set(this);
        });

        uploadInstance.on('end', function (error, fileObj) {
            if (error) {
                // window.alert('Error during upload: ' + error.reason);
                Bert.alert('Error during upload', 'danger', 'growl-top-right');

                if (source == 'profile')
                    self.currentProfileUpload.set(false);
                if (source == 'id')
                    self.currentUpload.set(false);
            } else {
                if (source == 'profile') {
                    self.currentProfileUpload.set(false);
                    self.profileImage.set(fileObj._id);
                }
                if (source == 'id') {
                    self.imageID.set(fileObj._id);
                    self.currentUpload.set(false);
                }
            }
        });

        uploadInstance.start();
    };
});

Template.entitiesProfile.helpers({
    countries: function () {
        return COUNTRIES;
    },
    id: function() {
        return Router.current().params.id;
    },
    class_id: function(code){
        if(Router.current().params.id == code)
            return 'active';
    },
    fade_class_id: function(code){
      if(Router.current().params.id == code)
            return 'in active';  
    },
    isCountrySelected: function (code) {
        if (Meteor.user() && Meteor.user().profile)
            return code == Meteor.user().profile.country;
        else
            return false;
    },
    disableEmail: function () {
        return Meteor.user() && Meteor.user().emails && (Meteor.user().emails.length > 0);
    },
    getUserEmail: function () {
        return Meteor.user() && Meteor.user().emails && (Meteor.user().emails.length > 0) ? Meteor.user().emails[0].address : null;
    },
    currentUpload: function () {
        return Template.instance().currentUpload.get();
    },
    currentProfileUpload: function () {
        return Template.instance().currentProfileUpload.get();
    },
    profileImage: function () {
        return Template.instance().profileImage.get();
    },
    imageID: function () {
        return Template.instance().imageID.get();
    },
    emailInUse : function(){
        return Template.instance().emailInUse.get();
    },
    applicationStatus: function () {
        Meteor.subscribe('users.application-status');
        return Meteor.user();
    }
});

Template.entitiesProfile.events({
    'click .btn-rgstr': function (event, template) {
        let field = $(event.target).data('field');
        Meteor.call('users.apply', `${field}_status`, (err) => {
            if (err) {
                // alert(err)
                Bert.alert(err, 'danger', 'growl-top-right');
            } else {
                // alert('Application sent.')
                Bert.alert("Application set.", 'success', 'growl-top-right');
            }
        });
    },

    'click #select-profile-image': function (event, template) {
        $('#upload-profile-image').click();
    },

    'click #upload-box': function (event, template) {
        $('#image-id').click();
    },

    'submit .entity-add-form': function (event, template) {
        event.preventDefault();

        let target = event.target;
        let name = target.name;
        let email = target.email;
        let address1 = target.address1;
        let address2 = target.address2;
        let city = target.city;
        let postal = target.postal;
        let wallet = web3.eth.defaultAccount;

        let options = {
            'profile.name': name.value,
            'profile.address1': address1.value,
            'profile.address2': address2.value,
            'profile.city': city.value,
            'profile.country': target.country.value,
            'profile.postal': postal.value,
            'profile.category': target.entity_category.value,
            'profile.profileImage': (template.profileImage.get() || (Meteor.user().profile && Meteor.user().profile.profileImage)) || '',
            'profile.imageID': (template.imageID.get() || (Meteor.user().profile && Meteor.user().profile.imageID)) || '',
        };

        // if(Meteor.user().emails.length == 0)
        options.emails = [{
            address: email.value
        }];
        
        Meteor.call('users.update_profile', options, (err, res) => {
            if (err) {
                console.log(err);
                Bert.alert({
                    title: 'Failed To Save.',
                    message: 'This email is already in use.',
                    type: 'danger',
                    style: 'growl-top-right',
                });
            } else {
                template.profileImage.set(null)
                template.imageID.set(null)
                // alert('Changes saved.')
                Bert.alert("Changes saved.", 'success', 'growl-top-right');
            }
        });
    },

    'input #emailInput': _.debounce((event, template) => {
        const email = event.target.value;
        checkEmailExists(email)
        .then((isEmailPresent) => {
            if(isEmailPresent) {
                Bert.alert({
                    title: 'Email Already In Use',
                    message: 'Email already in use. Please choose a different address.',
                    type: 'danger',
                    style: 'growl-top-right',
                });
                template.emailInUse.set(true);
            } else {
                template.emailInUse.set(false);                    
            }
        })
        .catch((err) => {
            console.log(err);
        });
    }, 800),

    'change #upload-profile-image': function (event, template) {
        if (event.currentTarget.files && event.currentTarget.files[0]) {
            var file = event.currentTarget.files[0];
            if (file) {
                template.doUpload(event, file, 'profile');
            }
        }
    },

    'dragover #upload-box, dragenter #upload-box'(event, template) {
        event.preventDefault();
        event.stopPropagation();
        event.originalEvent.dataTransfer.dropEffect = 'copy';
    },

    'drop #upload-box'(event, template) {
        event.preventDefault();
        event.stopPropagation();
        event.originalEvent.dataTransfer.dropEffect = 'copy';
        var file = event.originalEvent.dataTransfer.files[0];
        if (file) {
            template.doUpload(event, file, 'id');
        }
        return false;
    },

    'change #image-id': function (event, template) {
        if (event.currentTarget.files && event.currentTarget.files[0]) {
            var file = event.currentTarget.files[0];
            if (file) {
                template.doUpload(event, file, 'id');
            }
        }
    }
});

function checkEmailExists(email){
    return new Promise((resolve,reject) => {
        Meteor.call("users.findByEmail", email, (err, isEmailPresent) => {
            if(err){
                reject(err);
            } else {
                resolve(isEmailPresent);
            }
        });
    });
}