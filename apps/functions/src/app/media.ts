import { initializeApp } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";
import * as fs from "fs";
import * as functions from "firebase-functions";
import * as os from "os";
import * as path from "path";
import * as sharp from "sharp";
import env from '@env';

sharp.cache(false);

// Initialize the Firebase Admin SDK
initializeApp();

function log(msg: string) {
  functions.logger.log(msg)
}


function crop(path: string, rect: string, output: string) {
  const [left, top, width, height] = rect.split(',').map(v => parseInt(v.trim(), 10));

  return sharp(path, { failOnError: false })
    .extract({left, top, width, height})
    .toFile(output);
}

function resize(path: string, width: number, output: string) {
  return sharp(path, { failOnError: false })
  .resize(width)
  .toFile(output);
}

/**
 * When an image is uploaded in the Storage bucket, we generate a resized image automatically using
 * the Sharp image converting library.
 */
const storageBucket = env.firebase.options.storageBucket;


// export const onImgUploaded = functions.storage.bucket(storageBucket).object().onFinalize(cropImg);
export const onImgDeleted = functions.storage.bucket(storageBucket).object().onDelete(removeCroppedImg);
export const onMetadataChange = functions.storage.bucket(storageBucket).object().onMetadataUpdate(async object => {
  await removeCroppedImg(object);
  await cropImg(object);
});


async function removeCroppedImg(object: functions.storage.ObjectMetadata) {
  const { contentType, name, metadata, contentEncoding } = object; // This is the image MIME type

  if (!name) return log('no name');
  if (!contentType) return log('no content type');
  if (!contentType.startsWith("image/")) return log('not an image');
  if (!metadata) return log('no metadata');
  if (contentEncoding === "gzip") return log('gzip file');

  const { rect, resizedImage } = metadata;
  if (resizedImage || resizedImage === "true") return log('cropped image. Do nothing');
  if (!rect) return log('images was not cropped');

  const bucket = getStorage().bucket(object.bucket);

  const extension = path.extname(name);
  const dir = path.dirname(name);
  const baseName = path.basename(name, extension);

  const [files] = await bucket.getFiles({ prefix: `${dir}/${baseName}` });
  for (const file of files) {
    file.delete();
  }
}


async function cropImg(object: functions.storage.ObjectMetadata) {
  const { contentType, name, contentEncoding } = object; // This is the image MIME type

  if (!name) return log('no name');
  if (!contentType) return log('no content type');
  if (!contentType.startsWith("image/")) return log('not an image');
  if (!object.metadata) return log('no metadata');
  if (contentEncoding === "gzip") return log('gzip file');
  
  const { rect, resizedImage } = object.metadata;
  if (resizedImage || resizedImage === "true") return log('already resized');
  if (!rect) return log('No rect provided in metadata');


  const bucket = getStorage().bucket(object.bucket);
  const fileDir = path.dirname(name);
  const fileExtension = path.extname(name);
  const fullName = path.basename(name);
  const baseName = path.basename(name, fileExtension);

  let tempFilePath = '';
  let tempCroppedFile = '';
  try {
    tempFilePath = path.join(os.tmpdir(), fullName);

    log('Downloading image');
    await bucket.file(name).download({ destination: tempFilePath, validation: false });

    tempCroppedFile = path.join(os.tmpdir(), `cropped_${fullName}`);

    log('Cropping image');
    await crop(tempFilePath, rect, tempCroppedFile);

    log('Uploading images');
    const metadata = { metadata: { resizedImage: true } };
    bucket.upload(tempCroppedFile, {
      destination: `${fileDir}/${baseName}/${rect}${fileExtension}`,
      metadata
    });
    
    for (let w = 40; w < 500; w = w+80) {
      const temp = path.join(os.tmpdir(), `${w}w_${fullName}`);
      await resize(tempCroppedFile, w, temp);
      bucket.upload(temp, {
        destination: `${fileDir}/${baseName}/${w}w_${rect}${fileExtension}`,
        metadata
      })
    }
    
  } catch (err) {
    functions.logger.error(err)
  } finally {
    log('remove temp files');
    if (tempFilePath) fs.unlinkSync(tempFilePath);
    if (tempCroppedFile) fs.unlinkSync(tempCroppedFile);
  }
}