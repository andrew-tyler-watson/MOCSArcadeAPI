/**
 * These are adapter functions for ease of access to the google drive API
 */

const { google } = require('googleapis');
const fs = require('fs');
var path = require('path');
const scopes = [
    'https://www.googleapis.com/auth/drive'
];

const auth = new google.auth.JWT(
    process.env.DRIVE_CLIENT_EMAIL, null,
    process.env.DRIVE_PRIVATE_KEY, scopes
);
const drive = google.drive({ version: "v3", auth });

async function uploadImage(filepath, gameId, fileExtension) {
    var fileMetadata = {
      'name': gameId + '-' + (((1+Math.random())*0x10000)|0).toString(16).substring(1) + '.' + fileExtension,
      'parents': [process.env.DRIVE_ROOT_FOLDER_ID]
    };
    var media = {
      mimeType: 'image/' + fileExtension,
      body: fs.createReadStream(filepath)
    };
    await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id'
    }, function (err, file) {
      if (err) {
        // Handle error
        console.error(err);
      } else {
        console.log('File Id: ', file.data.id);
      }
    });
}

async function deleteImage(fileId) {
    await drive.files.delete({fileId: fileId},
      function (err, file) {
      if (err) {
        // Handle error
        console.error(err);
      } else {
        console.log('File Id: ', file.data.id);
      }
    });
}

async function getImagesContentByGameId(gameId) {
    // Return files as a dictionary of content with keys as google drive ID, and values as file content
    
}

async function getImageViewURLsByGameId(gameId) {
    // Return files as a dictionary of content with keys as google drive ID, and values as file content
    
}

module.exports = {
    uploadImage,
    deleteImage,
    getImagesContentByGameId,
    getImageViewURLsByGameId
}