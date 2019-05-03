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
const getStream = require('into-stream');
const multer = require('multer');
const uuidv4 = require('uuid/v4');

const {
  AZURE_STORAGE_ACCOUNT_NAME,
  AZURE_STORAGE_ACCOUNT_ACCESS_KEY
} = require('../config');

const url = `https://${AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net`;

const inMemoryStorage = multer.memoryStorage();
const uploadStrategy = multer({ storage: inMemoryStorage }).single('image');
const router = express.Router();
const CONTAINER_NAME = 'images';
const ONE_MEGABYTE = 1024 * 1024;
const ONE_MINUTE = 60 * 1000;
const uploadOptions = { bufferSize: 4 * ONE_MEGABYTE, maxBuffers: 20 };

const sharedKeyCredential = new SharedKeyCredential(AZURE_STORAGE_ACCOUNT_NAME, AZURE_STORAGE_ACCOUNT_ACCESS_KEY);
const pipeline = StorageURL.newPipeline(sharedKeyCredential);
const serviceURL = new ServiceURL(url, pipeline);
const getBlobName = originalName => `${uuidv4()}-${originalName}`;

router.post('/', uploadStrategy, (req, res) => {
  const aborter = Aborter.timeout(30 * ONE_MINUTE);
  const blobName = getBlobName(req.file.originalname);
  const stream = getStream(req.file.buffer);
  const containerURL = ContainerURL.fromServiceURL(serviceURL, CONTAINER_NAME);
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

router.get('/', (req, res) => {
  res.json(['testing', 'it', 'out']);
});
module.exports = router;