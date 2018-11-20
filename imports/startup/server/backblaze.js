import BackblazeInfo from '../../api/backblaze.js';
import Files from '../../api/files.collection.js';
import request from 'request';

const fs = require("fs");

let B2 = require("backblaze-b2");
let b2 = new B2({
    accountId: Meteor.settings.backblaze.accountId,
    applicationKey: Meteor.settings.backblaze.applicationKey
});


let init = async () => {
    let info = await b2.authorize();
    BackblazeInfo.update({}, {
        $set: {
            downloadUrl: info.data.downloadUrl,
            apiUrl: info.data.apiUrl,
            authToken: info.data.authorizationToken
        }
    }, {
            upsert: true
        });
    return info.data;
};

let uploadToBackblaze = async (_filename, _fileStream, _id, _bucket = null) => {
    await init();
    var response = await b2.getUploadUrl(Meteor.settings.backblaze.buckets[_bucket].id);
    let result = await b2.uploadFile({
        uploadUrl: response.data.uploadUrl,
        uploadAuthToken: response.data.authorizationToken,
        filename: _filename,
        data: _fileStream
    });
    await Files.update({
        _id: _id
    }, {
            $set: {
                'meta.backblazeId': result.data.fileId
            }
        }, {
            upsert: true
        });
    Files.unlink(Files.findOne({
        _id: _id
    }));
    return result.data.fileId;
};

let getFileInfo = async (_fileId) => {
    await init();
    let info = await b2.getFileInfo(_fileId);
    return info;
}

let doDownloadFile = (_url, _authToken) => {
    return new Promise((resolve, reject) => {
        request({
            url: _url,
            encoding: null,
            headers: {
                Authorization: _authToken
            }
        }, (err, response, body) => {
            if (err) {
                reject(err);
            }

            if (!body) {
                reject('Error retrieving image - Empty Body!');
            }

            if (body && response.statusCode === 200) {
                let result = body.toString('base64');
                resolve(result);
            }
        });
    })
}

let downloadFile = async (_url) => {
    let info = await init();
    let result = await doDownloadFile(_url, info.authorizationToken);
    return result;
}

let uploadEmailImages = async (filesToUpload = []) => {
    let pathToImageFolder = "../../../../../public/images/email";
    const info = await init();
    (filesToUpload || []).forEach(async file => {
        let response = await b2.getUploadUrl(Meteor.settings.backblaze.buckets["email"].id);
        let result = await b2.uploadFile({
            uploadUrl: response.data.uploadUrl,
            uploadAuthToken: response.data.authorizationToken,
            filename: file,
            data: fs.readFileSync(pathToImageFolder + "/" + file)
        });
        console.log("Uploaded", file);
    });
    return info;
}

backblaze = {};
backblaze.upload = uploadToBackblaze;
backblaze.init = init;
backblaze.fileInfo = getFileInfo;
backblaze.downloadFile = downloadFile;
backblaze.uploadEmailImages = uploadEmailImages;