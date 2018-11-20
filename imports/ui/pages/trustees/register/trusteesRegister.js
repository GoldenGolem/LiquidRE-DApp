import './trusteesRegister.html';
import '../../../stylesheets/register-trustee.scss';
import Files from '../../../../api/files.collection.js';

Template.trusteesRegister.onCreated(function trusteesOnCreated() {
    // cbWrap(cb => trusteeFactory.isTrusteeOwner.call(web3.eth.defaultAccount, cb), res => {
    //     if (res)
    //         Router.go('/trustees/dashboard');
    // });

    this.currentUpload = new ReactiveVar(false);
    this.imageID = new ReactiveVar(null);
    var self = this;

    this.doUpload = (event, file) => {
        var uploadInstance = Files.insert({
            meta: {
                bucket: 'identification'
            },
            file: file,
            streams: 'dynamic',
            chunkSize: 'dynamic'
        }, false);

        uploadInstance.on('start', function () {
            self.currentUpload.set(this);
        });

        uploadInstance.on('end', function (error, fileObj) {
            if (error) {
                window.alert('Error during upload: ' + error.reason);
                self.currentUpload.set(false);
            } else {
                self.imageID.set(fileObj._id);
                self.currentUpload.set(false);
                // Meteor.call('file.url', fileObj._id, function (err, res) {
                //     self.imageID.set(res);
                //     self.currentUpload.set(false);
                // })
            }
        });

        uploadInstance.start();
    };

});

Template.trusteesRegister.helpers({
    currentUpload: function () {
        return Template.instance().currentUpload.get();
    },
    imageID: function () {
        return Template.instance().imageID.get();
    }
});

Template.trusteesRegister.events({
    'click #create-trustee': function (event, template) {
        let name = template.find('#trustee-name').value;
        let address = template.find('#trustee-address').value;
        Meteor.call('users.apply-trustee', name, address, template.imageID.get(),
            (error) => {
                if (error) {
                    console.log(error)
                    // alert(error.error);
                    Bert.alert( error.error , 'danger', 'growl-top-right' );
                } else {
                    template.find('#trustee-name').value = '';
                    template.find('#trustee-address').value = '';
                    template.imageID.set(null);
                    // alert("Application sent.")
                    Bert.alert( "Application sent." , 'success', 'growl-top-right' );
                    Router.go('/trustees');
                }
            });
    },
    'change #image-id': function (event, template) {
        if (event.currentTarget.files && event.currentTarget.files[0]) {
            var file = event.currentTarget.files[0];
            if (file) {
                template.doUpload(event, file);
            }
        }
    },
    'click #upload-box': function (event, template) {
        $('#image-id').click();
    },
});