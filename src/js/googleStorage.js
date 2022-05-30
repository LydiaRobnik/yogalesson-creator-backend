// By default, the client will authenticate using the service account file
// specified by the GOOGLE_APPLICATION_CREDENTIALS environment variable and use
// the project specified by the GOOGLE_CLOUD_PROJECT environment variable. See
// https://github.com/GoogleCloudPlatform/google-cloud-node/blob/master/docs/authentication.md
// These environment variables are set automatically on Google App Engine
import { Storage } from "@google-cloud/storage";

import dotenv from "dotenv";
import path from "path";

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

class GoogleBucket {
  constructor() {
    if (process.env.NODE_ENV !== "production") {
      console.log("!! development !!");
      this.storage = new Storage({
        keyFilename: path.resolve(`src/monkeyplan-3a283b36fcf9.json`)
      });
    } else {
      console.log("!! Production !!");
      // ! in gcloud deployed app, the keyfile is not needed
      this.storage = new Storage();
    }

    this.bucket = this.storage.bucket(process.env.GCS_BUCKET);

    console.log("Google Bucket Created >> ", this.bucket.id);
  }

  async uploadFile(file, mimetype, path, metadata) {
    const bucketFile = this.bucket.file(path);

    const stream = bucketFile.createWriteStream({
      metadata: {
        contentType: mimetype,
        ...metadata
      }
    });

    stream.on("error", (err) => {
      // req.file.cloudStorageError = err;
      throw err;
    });

    stream.on("finish", () => {
      console.log("Uploaded file to GCS");
      // req.file.cloudStorageObject = gcsFileName;

      // return file.makePublic()
      //   .then(() => {
      //     req.file.gcsUrl = gcsHelpers.getPublicUrl(bucketName, gcsFileName);
      //     next();
      //   });
    });

    stream.end(file.buffer);
  }

  async uploadBase64(base64, contentType, path, metadata) {
    // another way to upload file -> https://stackoverflow.com/questions/42879012/how-do-i-upload-a-base64-encoded-image-string-directly-to-a-google-cloud-stora
    const imageBuffer = Buffer.from(base64, "base64");
    // Store file to storage/bucket
    const resp = await this.bucket.file(path).save(imageBuffer, {
      metadata: {
        contentType,
        ...metadata
      }
    });

    console.log("Uploaded file to GCS", resp);
  }
}

// async function listBuckets() {
//   try {
//     const results = await storage.getBuckets();

//     const [buckets] = results;

//     console.log("Buckets:");
//     buckets.forEach((bucket) => {
//       console.log(bucket.name);
//     });
//   } catch (err) {
//     console.error("ERROR:", err);
//   }
// }
// listBuckets();

// Singleton pattern
export default new GoogleBucket();
// export default GoogleStorage;
