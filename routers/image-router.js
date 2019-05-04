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
const uuidv4 = require('uuid/v4');

const {
  AZURE_STORAGE_ACCOUNT_NAME,
  AZURE_STORAGE_ACCOUNT_ACCESS_KEY
} = require('../config');

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
const sharedKeyCredential = new SharedKeyCredential(AZURE_STORAGE_ACCOUNT_NAME, AZURE_STORAGE_ACCOUNT_ACCESS_KEY);
const pipeline = StorageURL.newPipeline(sharedKeyCredential);
const serviceURL = new ServiceURL(url, pipeline);
const containerURL = ContainerURL.fromServiceURL(serviceURL, CONTAINER_NAME);

// Returns an array of URLs of images
router.get('/', (req, res) => {
  containerURL.listBlobFlatSegment(Aborter.none)
    .then(listBlobsResponse => {
      res.json(listBlobsResponse.segment.blobItems.map(item => {
        return `${containerURL.storageClientContext.url}/${item.name}`;
      }));
    });
});

// Uploads images to BlobStorage
router.post('/', uploadStrategy, (req, res) => {
  const aborter = Aborter.timeout(30 * ONE_MINUTE);
  const blobName = `${uuidv4()}-${req.file.originalname}`;
  const stream = intoStream(req.file.buffer);
  const blockBlobURL = BlockBlobURL.fromContainerURL(containerURL, blobName);

  uploadStreamToBlockBlob(
    aborter,
    stream,
    blockBlobURL,
    uploadOptions.bufferSize,
    uploadOptions.maxBuffers
  ).then(() => res.json({ message: 'File uploaded to Azure Blob storage.' }))
    .catch(err => res.json({ message: err.message }));
});

module.exports = router;