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
    this.storage = new Storage({
      keyFilename: path.resolve(`src/monkeyplan-3a283b36fcf9.json`)
    });

    this.bucket = this.storage.bucket(process.env.GCLOUD_STORAGE_BUCKET);

    console.log("Google Bucket Created >> ", this.bucket.id);
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
export default new GoogleBucket().bucket;
// export default GoogleStorage;
