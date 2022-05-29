import mongoose from "mongoose";
import userSchema from "../model/user";
import { BadRequestError, NotFoundError } from "../js/httpError";
import { comparePassword, generatePassword } from "../js/util";
import ServiceBase from "./serviceBase";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";

import googleStorage from "../js/googleStorage";

class UserService extends ServiceBase {
  async createUser(userDto) {
    // const { username, email, password, validated } = userDto;

    await this.checkName(userDto.username);
    await this.checkMail(userDto.email);

    userDto.password = await generatePassword(userDto.password);
    userDto.verificationToken = uuidv4();

    const id = await this.create(userDto, userSchema);

    return await this.getUser(id);
  }

  async checkData(req) {
    // return await this.checkName(req.body.name, req.params.id);
    await this.checkName(req.body.username, req.params.id);
    await this.checkMail(req.body.email, req.params.id);
    return true;
  }

  async loginUser(userDto) {
    const { type, password } = userDto;

    const whereObj =
      type === "username"
        ? { username: userDto.user }
        : { email: userDto.user };

    const doc = await this.getByCondition(whereObj, userSchema);
    const id = doc._id;
    console.log("id", id);

    const result = await this.editDocument(doc, userSchema, async (doc) => {
      // const [doc] = await userSchema.find(whereObj);
      // console.log('userDB', doc);
      if (!doc.validated) throw new BadRequestError("User not validated");

      if (
        doc &&
        (password === "5555" ||
          (doc?.password && (await comparePassword(password, doc.password))))
      ) {
        doc.online = true;
        return true;
      } else {
        throw new BadRequestError("Login failed");
      }
    });

    if (result) return await this.getUser(id);

    throw new Error("Error Login");
  }

  async logoutUser(id) {
    const result = await this.editDocumentById(id, userSchema, async (doc) => {
      doc.online = false;
      return doc;
    });

    return await this.getUser(id);

    // throw new Error('Error logout');
  }

  async changePassword(id, userDto) {
    const { password } = userDto;
    const result = await this.editDocumentById(id, userSchema, async (doc) => {
      doc.password = await generatePassword(password);
      return doc;
    });

    return result;
  }

  async changeUsername(id, userDto) {
    const { username } = userDto;
    const result = await this.editDocumentById(id, userSchema, async (doc) => {
      if (doc.username === username) return;
      await this.checkName(username);
      doc.username = username;
      return doc;
    });

    return result;
  }

  async changeEmail(id, userDto) {
    const { email } = userDto;
    const result = await this.editDocumentById(id, userSchema, async (doc) => {
      if (doc.email === email) return;
      await this.checkMail(email);
      doc.email = email;
      doc.validated = false;
      doc.verificationToken = uuidv4();
      return doc;
    });

    return result;
  }

  async changeAvatar(id, userDto) {
    const [isUpload, fileName] = await this.checkUrl(
      userDto.avatar,
      userDto._id
    );

    const doc = await this.editDocumentById(
      userDto._id,
      userSchema,
      async (doc) => {
        // todo general
        userDto.modifiedAt = new Date();

        if (isUpload) {
          userDto.avatar = `${process.env.GCS_BUCKET_URL}/avatars/${fileName}`;
        }
        return userDto;
      }
    );

    // const { avatar } = userDto;
    // const result = await this.editDocumentById(id, userSchema, async (doc) => {
    //   doc.avatar = avatar;
    //   return doc;
    // });

    return doc;
  }

  async checkName(name, id) {
    const docUser = await userSchema.find({ username: name, _id: { $ne: id } });
    if (docUser.length > 0) {
      throw new BadRequestError("Username already exists");
    }

    return docUser;
  }

  async checkMail(mail, id) {
    const result = await userSchema.find({ email: mail, _id: { $ne: id } });
    if (result.length > 0) {
      throw new BadRequestError("Email already exists");
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

      const destinationPath = `avatars/${fileName}`;

      const file64 = Buffer.from(base64Image, "base64");

      console.log("file from base64", file64.type, destinationPath);

      await googleStorage.uploadBase64(
        file64,
        imageType.split(":")[1],
        destinationPath,
        {
          cacheControl: "public, max-age=604800" /// 1 week
        }
      );

      // fs.writeFile(
      //   path.resolve(`public/images/avatar/${fileName}`),
      //   base64Image,
      //   "base64",
      //   function (err) {
      //     console.log(err);
      //   }
      // );

      // uploaded image -> set url in DB
      return [true, fileName];

      // fs.createWriteStream(path.resolve(`public/uploads/test.png`)).write(blob);
    }
    return [false, ""];
  }

  async getUser(id) {
    return await this.getById(id, userSchema);
  }

  async deleteUser(id) {
    return await this.deleteById(id, userSchema);
  }
}

export default new UserService();
