const {
  Aborter,
  BlockBlobURL,
  ContainerURL,
  ServiceURL,
  StorageURL,
  SharedKeyCredential,
  uploadStreamToBlockBlob
} = require('@azure/storage-blob');
const express = require('express');
const intoStream = require('into-stream');
const multer = require('multer');
const passport = require('passport');
const uuidv1 = require('uuid/v1');

const {
  AZURE_STORAGE_ACCOUNT_NAME,
  AZURE_STORAGE_ACCOUNT_ACCESS_KEY
} = require('../config');
const Image = require('../models/image-model');

const jwtAuth = passport.authenticate('jwt', { session: false, failWithError: true });

// Create router
const router = express.Router();

// Configure multer
const inMemoryStorage = multer.memoryStorage();
const uploadStrategy = multer({ storage: inMemoryStorage }).single('image');

// Configure Azure Storage
const url = `https://${AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net`;
const CONTAINER_NAME = 'images';
const ONE_MEGABYTE = 1024 * 1024;
const ONE_MINUTE = 60 * 1000;
const uploadOptions = { bufferSize: 4 * ONE_MEGABYTE, maxBuffers: 20 };
// SharedKeyCredential for account key authorization of Azure Storage service.
const sharedKeyCredential = new SharedKeyCredential(AZURE_STORAGE_ACCOUNT_NAME, AZURE_STORAGE_ACCOUNT_ACCESS_KEY);
// A Pipeline class containing HTTP request policies.
const pipeline = StorageURL.newPipeline(sharedKeyCredential);
// A ServiceURL represents a URL to the Azure Storage File service allowing you to manipulate file shares.
const serviceURL = new ServiceURL(url, pipeline);
//A ContainerURL represents a URL to the Azure Storage container allowing you to manipulate its blobs.
const containerURL = ContainerURL.fromServiceURL(serviceURL, CONTAINER_NAME);

// Returns an array of URLs of images
router.get('/', (req, res) => {
// The List Blobs operation returns a list of the blobs under the specified container
// Aborter will not timeout
  containerURL.listBlobFlatSegment(Aborter.none)
    .then(listBlobsResponse => {
      res.json(listBlobsResponse.segment.blobItems.map(item => {
        return `${containerURL.storageClientContext.url}/${item.name}`;
      }));
    });
});

// Uploads images to BlobStorage
router.post('/', jwtAuth, uploadStrategy, (req, res) => {
  // Timeout after 30 minutes
  const aborter = Aborter.timeout(30 * ONE_MINUTE);
  // Add a random string before the original filename
  const blobName = `${uuidv1()}-${req.file.originalname}`;
  // Convert image to stream
  const stream = intoStream(req.file.buffer);
  // BlockBlobURL defines a set of operations applicable to block blobs.
  const blockBlobURL = BlockBlobURL.fromContainerURL(containerURL, blobName);

  // Upload to Blob Storage
  uploadStreamToBlockBlob(
    aborter,
    stream,
    blockBlobURL,
    uploadOptions.bufferSize,
    uploadOptions.maxBuffers
  )
    .then(() => {
      Image.create({ url: blockBlobURL.url, username: req.user.username });
    })
    .then(() => {
      res.json({ message: 'File uploaded to Azure Blob storage.' });
    })
    .catch(err => res.json({ message: err.message }));
});

module.exports = router;