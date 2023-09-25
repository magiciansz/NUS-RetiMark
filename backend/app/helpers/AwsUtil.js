const AWS = require("aws-sdk");
const env = require("dotenv");
env.config();

const useLocal = process.env.NODE_ENV === "TEST";
const AWS_BUCKET = process.env.AWS_BUCKET;
const s3 = new AWS.S3({
  endpoint: useLocal ? "http://127.0.0.1:4566" : undefined,
  s3ForcePathStyle: true,
  params: {
    Bucket: AWS_BUCKET,
  },
});

module.exports = s3;
