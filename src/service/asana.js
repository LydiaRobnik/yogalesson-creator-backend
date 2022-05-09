import mongoose from "mongoose";
import ServiceBase from "./serviceBase";
import asanaSchema from "../model/asana";
import { BadRequestError } from "../js/httpError";
import fetch from "node-fetch";

import fs from "fs";
import path from "path";
import https from "https";
// import pokedex from '../model/pokedex.json';

class AsanaService extends ServiceBase {
  async createAsana(asanaDto) {
    await this.checkName(asanaDto.asana.sanskrit);

    const id = await this.create(asanaDto, asanaSchema);
    const [isUpload, fileName] = await this.checkUrl(asanaDto.img_url, id._id);

    if (isUpload) {
      await this.editDocumentById(id._id, asanaSchema, (doc) => {
        doc.img_url = `https://yogalesson-createor-backend.herokuapp.com/images/asana/${fileName}`;
        return doc;
      });
    }

    return id;
  }

  async updateAsana(asanaDto) {
    await this.checkName(asanaDto.asana.sanskrit, asanaDto._id);
    const [isUpload, fileName] = await this.checkUrl(
      asanaDto.img_url,
      asanaDto._id
    );

    const id = await this.editDocumentById(
      asanaDto._id,
      asanaSchema,
      async (doc) => {
        // todo general
        asanaDto.modifiedAt = new Date();

        if (isUpload) {
          asanaDto.img_url = `https://yogalesson-createor-backend.herokuapp.com/images/asana/${fileName}`;
        }
        return asanaDto;
      }
    );

    // if (isUpload) {
    //   await this.editDocumentById(id._id, asanaSchema, (doc) => {
    //     doc.img_url = `https://yogalesson-createor-backend.herokuapp.com/images/asana/${fileName}`;
    //     return doc;
    //   });
    // }

    return id;
  }

  async checkData(req) {
    return await this.checkName(req.body.asana.sanskrit, req.params.id);
    // return await this.checkUrl(req.body.img_url);
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

  async checkUrl(url, id) {
    // console.log("checkUrl", url);

    if (url.startsWith("data:image")) {
      // Remove header
      let [imageType, base64Image] = url.split(";base64,");

      // avoid browser cache
      const addRandomNumber = Math.floor(Math.random() * 1000);
      const fileName = `${id}${addRandomNumber}.${imageType.split("/")[1]}`;

      fs.writeFile(
        path.resolve(`public/images/asana/${fileName}`),
        base64Image,
        "base64",
        function (err) {
          console.log(err);
        }
      );

      // uploaded image -> set url in DB
      return [true, fileName];

      // fs.createWriteStream(path.resolve(`public/uploads/test.png`)).write(blob);
    }
    return [false, ""];
  }

  async customAdminFunction() {
    console.log("customAdminFunction");

    // this.testSetNewAsanaUrl();

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

    // all.length = 1;

    for (let asana of all) {
      await this.editDocumentById(asana._id, asanaSchema, (doc) => {
        doc.img_url = `https://yogalesson-createor-backend.herokuapp.com/images/asana/${asana._id}.svg`;
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
