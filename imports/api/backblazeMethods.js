
import Files from './files.collection.js';
import BackblazeInfo from './backblaze.js';

Meteor.methods({
    'file.url' (_id) {
        let info = BackblazeInfo.findOne({});
        var file = Files.findOne({_id: _id});
        do {
            file = Files.findOne({_id: _id});
        } while(!file.meta.backblazeId)

        let url = `${info.downloadUrl}/b2api/v1/b2_download_file_by_id?fileId=${file.meta.backblazeId}`;
        if(!file.meta.bucket || file.meta.bucket == 'files')
            return url;
        else {
            var result = Promise.await(backblaze.downloadFile(url)); 
            return `data:image/${file.ext};base64,${result}`;
        }
    }
});