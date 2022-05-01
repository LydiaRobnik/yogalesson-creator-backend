import mongoose from "mongoose";
import ServiceBase from "./serviceBase";
import asanaSchema from "../model/asana";
import { BadRequestError } from "../js/httpError";

import fs from "fs";
import https from "https";
// import pokedex from '../model/pokedex.json';

class AsanaService extends ServiceBase {
  async checkData(req) {
    return await this.checkName(req.body.asana.sanskrit, req.params.id);
  }

  async checkName(name, id) {
    const result = await asanaSchema.find({
      "asana.sanskrit": name,
      _id: { $ne: id }
    });
    if (result.length > 0) {
      throw new BadRequestError("Asananame already exists");
    }

    return result;
  }

  async customAdminFunction() {
    console.log("customAdminFunction");

    this.testSetNewAsanaUrl();

    // const res = await asanaSchema.updateMany({}, { $unset: { id: 1 } });
    // console.log("res", res);
    // const all = await this.getAll(asanaSchema);

    // for (let asana of all) {
    //   await this.editDocumentById(asana._id, asanaSchema, (doc) => {
    //     doc.default = true;
    //     doc.id = undefined;
    //     // delete doc.user_id;
    //     console.log("doc", doc);
    //     return doc;
    //   });
    // }

    return true;
  }

  async testSetNewAsanaUrl() {
    const all = await this.getAll(asanaSchema);

    for (let asana of all) {
      await this.editDocumentById(asana._id, asanaSchema, (doc) => {
        doc.img_url = doc.img_url
          .replaceAll("?raw=1", "")
          .replaceAll("com/s/", "com/s/raw/");
        return doc;
      });
    }

    return true;
  }

  async testSaveAsanaImages() {
    const all = await this.getAll(asanaSchema);

    // all.length = 2;

    const array302 = [];
    for (let asana of all) {
      const imgUrl = asana.img_url
        .replaceAll("?raw=1", "")
        .replaceAll("com/s/", "com/s/raw/");

      console.log("imgUrl", imgUrl);

      await downloadImage(
        imgUrl,
        "public/images/asana/" + asana._id + ".svg",
        asana._id,
        array302
      ).catch((err) => console.log("err", err.message));

      // downloadImage(
      //   asana.img_url,
      //   "./src/public/images/asana/" + asana.id + ".jpg"
      // );
    }

    console.log("array302", array302);
    const array302_2 = [];

    for (let asana of array302) {
      const imgUrl = asana.location;

      // console.log("imgUrl", imgUrl, "\n");

      await downloadImage(
        imgUrl,
        "public/images/asana/" + asana.id + ".svg",
        asana.id,
        array302_2
      ).catch((err) => console.log("err", err.message));
    }
    console.log("array302_2", array302_2);

    for (let asana of array302_2) {
      const imgUrl = asana.location;

      // console.log("imgUrl", imgUrl, "\n");

      await downloadImage(
        imgUrl,
        "public/images/asana/" + asana.id + ".svg",
        asana.id,
        []
      ).catch((err) => console.log("err", err.message));
    }
    // downloadImage(
    //   all[0].img_url
    //     .replaceAll("?raw=1", "")
    //     .replaceAll("com/s/", "com/s/raw/"),
    //   "public/images/asana/" + all[0].id + ".svg"
    // );
    return true;
  }
}

function downloadImage(url, filepath, asanaId, array302) {
  console.log("downloadImage", url, filepath);
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 200) {
        res
          .pipe(fs.createWriteStream(filepath))
          .on("error", reject)
          .once("close", () => resolve(filepath));
      } else {
        // Consume response data to free up memory
        if (res.statusCode === 302) {
          console.log("error >> moved to: ", res.headers.location, "\n");

          let location = res.headers.location;
          if (!location.startsWith("https")) {
            location = url.substring(0, url.indexOf("/cd")) + location;
            console.log(">>> location", location, "\n");
          }
          array302.push({ location: location, id: asanaId });
        } else {
          console.log("❌ status", res.statusCode);
        }
        res.resume();
        reject(
          new Error(`Request Failed With a Status Code: ${res.statusCode}`)
        );
      }
    });
  });
}

export default new AsanaService();
