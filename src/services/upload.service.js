"use strict";
const cloudinary = require("../configs/cloudinary.config");

const crypto = require("crypto");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const { s3, PutObjectCommand } = require("../configs/s3.config");

// 1. upload from url image
const uploadImageFromUrl = async () => {
  try {
    const urlImage = 'https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-mckj5bkz4lukbc.webp';
    const folderName = 'product/8409', newFileName = 'testdemo';

    console.log(cloudinary.config())

    const result = await cloudinary.uploader.upload(urlImage, {
      public_id: newFileName,
      folder: folderName,
    })
    console.log(result)
    return result
  } catch (error) {
    throw new Error(error.message);
  }
}

// 2. upload image from local
const uploadImageFromLocal = async ({
  path,
  folderName = 'product/8409'

}) => {
  try {
    const result = await cloudinary.uploader.upload(path, {
      public_id: 'thumb',
      folder: folderName
    })
    console.log(result)
    return {
      image_url: result.secure_url,
      shopId: 8409,
      thumb_url: await cloudinary.url(result.public_id, {
        height: 100,
        width: 100,
        format: 'jpg'
      })
    }
  } catch (error) {
    console.error('Error uploading image::', error)
  }
}

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
  uploadImageFromUrl,
  uploadImageFromLocal,
  uploadImageFromLocalToS3
}
