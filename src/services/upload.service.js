"use strict";
const crypto = require("crypto");
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const { s3, PutObjectCommand } = require("../configs/s3.config");
/// upload file use S3Client ///


/// End S3 Service //////

const uploadImageFromLocalToS3 = async({
  file
}) => {
  try {
    const randomImageName = () => crypto.randomBytes(16).toString('hex')
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: randomImageName(),
      Body: file.buffer,
      ContentType: 'image/jpeg'
    })

    // export url
    const url = await getSignedUrl(s3, command, { expiresIn: 3600 })

    const result = await s3.send(command)

    return result
  } catch (error) {
    console.error('Error uploading image use S3Client::', error)
  }
}

module.exports = {
  uploadImageFromLocalToS3
}
