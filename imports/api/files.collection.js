import {
  Meteor
} from 'meteor/meteor';
import {
  FilesCollection
} from 'meteor/ostrio:files';
import fs from 'fs';
import {
  Random
} from 'meteor/random';

if (Meteor.isServer) {
  bound = Meteor.bindEnvironment(function (callback) {
    return callback();
  });
}

const Files = new FilesCollection({
  // debug: true,
  collectionName: 'Files',
  allowClientCode: false,
  onAfterUpload: async (fileRef) => {
    let _filename = `${fileRef._id}${fileRef.extensionWithDot}`;
    let _file = fs.readFileSync(fileRef.path);
    let _bucket = fileRef.meta.bucket;
    if(!_bucket)
        _bucket = 'files';
      
    await backblaze.upload(_filename, _file, fileRef._id, _bucket);
    return true;
},
  onBeforeUpload: function (file) {
    return true;
    // if (file.size <= 1024 * 1024 * 10 && /png|jpe?g/i.test(file.extension)) {
    //   return true;
    // }
    // return 'Please upload image, with size equal or less than 10MB';
  }
});

if (Meteor.isServer) {
  Files.denyClient();
  Meteor.publish('files.all', function () {
    return Files.find().cursor;
  });
} else {
  Meteor.subscribe('files.all');
}

export default Files;