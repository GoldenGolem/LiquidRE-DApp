import './diligences.html';
import './diligences.scss';
import Files from '../../../api/files.collection.js';
import IREOS from '../../../api/ireos/ireos.js';

Template.diligences.onCreated(function () {
    Session.set('activeTab', 'physical');
    this.uploadingPicture = new ReactiveVar(false);
    this.uploadingDocument = new ReactiveVar(false);
    this.address = this.data.ireoAddress;
    var self = this;
    this.doUpload = (event, file, source) => {
        var uploadInstance = Files.insert({
            file: file,
            streams: 'dynamic',
            chunkSize: 'dynamic'
        }, false);

        uploadInstance.on('start', function () {
            if (source.type == 'pictures')
                self.uploadingPicture.set(true);
            if (source.type == 'documents')
                self.uploadingDocument.set(true);
        });

        uploadInstance.on('end', function (error, fileObj) {
            if (source.type == 'pictures')
                self.uploadingPicture.set(false);
            if (source.type == 'documents')
                self.uploadingDocument.set(false);
            var _data = {
                address: self.address
            };
            if (error) {
                // window.alert('Error during upload: ' + error.reason);
                Bert.alert( `Error during upload: ${error.reason}` , 'danger', 'growl-top-right' );
            } else {
                if (
                    source.type == 'videos' && !fileObj.isVideo ||
                    source.type == 'documents' && !fileObj.isPDF ||
                    source.type == 'pictures' && !fileObj.isImage
                ) {
                    Bert.alert( 'Incorrect file type.', 'danger', 'growl-top-right' );
                } else {
                    _data = {
                        filename: fileObj.name,
                        description: '',
                        filesize: fileObj.size,
                        file: fileObj._id
                    };
                    Meteor.call('ireos.add_file', self.address, `${source.loc}.${source.type}`, _data, err => {
                        if (err){
                            Bert.alert( err , 'danger', 'growl-top-right' );
                        }
                        else {
                            Bert.alert( 'File was added successfully.', 'success', 'growl-top-right' );
                        }
                    })
                }
            }
        });

        uploadInstance.start();
    };
});

Template.diligences.events({
    'click #add-file-video': function (event, template) {
        var url = template.find('#file-youtube-url').value;
        var title = template.find('#file-youtube-title').value;
        var description = template.find('#file-youtube-description').value;
        let source = Session.get('activeTab');
        let _data = {
            youtube_url: url,
            description: description,
            title: title
        };
        Meteor.call('ireos.add_file', template.address, `${source}.videos`, _data, err => {
            if (err){
                // alert(err)
                Bert.alert( err , 'danger', 'growl-top-right' );
            }else {
                // alert('Video was added successfully.');
                Bert.alert( "Video was added successfully." , 'success', 'growl-top-right' );
                template.find('#file-youtube-url').value = '';
                template.find('#file-youtube-title').value = '';
                template.find('#file-youtube-description').value = '';
            }
        })
    },
    'click .btn-upload-file': function (event, template) {
        var loc = Session.get('activeTab');
        var type = $(event.target).data('type');
        Session.set('source', {
            'loc': loc,
            'type': type
        });
        $('#upload-file').click();
    },
    'change #upload-file': function (event, template) {
        if (event.currentTarget.files && event.currentTarget.files[0]) {
            var file = event.currentTarget.files[0];
            if (file) {
                template.doUpload(event, file, Session.get('source'));
            }
        }
    },
    'click .btn-modal': function (event, template) {
        var loc = $(event.target).data('loc');
        Session.set('activeTab', loc);
    }
});

Template.diligences.helpers({
    IREOInfo() {
        return ClientProperties.findOne({
            address: Template.instance().data.ireoAddress
        });
    },
    countFiles(_source, _type) {
        Meteor.subscribe('ireos.info', Template.instance().data.ireoAddress);
        let ireo = IREOS.findOne({
            address: Template.instance().data.ireoAddress
        });
        return (ireo && ireo[_source] && ireo[_source][_type]) ? ireo[_source][_type].length : null;
    },
    getFilesCaption(_source) {
        Meteor.subscribe('ireos.info', Template.instance().data.ireoAddress);
        let ireo = IREOS.findOne({
            address: Template.instance().data.ireoAddress
        });
        let _types = ['Documents', 'Videos', 'Pictures'];
        let captions = [];
        _types.forEach(_type => {
            let count = (ireo && ireo[_source] && ireo[_source][_type.toLowerCase()]) ? ireo[_source][_type.toLowerCase()].length : null;
            if (count)
                captions.push(`${count} ${_type}`);
        });
        return (captions.length > 0) ? captions.join(', ') : 'No Files';
    },
    isActiveTab(_tab) {
        return _tab == Session.get('activeTab');
    },
    activeTab() {
        return Session.get('activeTab');
    },
    isUploadingPicture() {
        return Template.instance().uploadingPicture.get();
    },
    isUploadingDocument() {
        return Template.instance().uploadingDocument.get();
    }
});