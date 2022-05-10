import { BadRequestError, NotFoundError } from "../js/httpError";
import service from "../service/auth";
import userService from "../service/user";
import userSchema from "../model/user";
import BaseController from "./controllerBase";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import { v4 as uuidv4 } from "uuid";

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

class AuthController extends BaseController {
  async loginUser(req, res, next) {
    try {
      const user = await userService.loginUser(req.body);

      const token = jwt.sign(
        {
          id: user._id,
          name: user.username,
          role: user.role,
          avatar: user.avatar
        }, // todo role
        process.env.JWT_SECRET
      );

      return res.status(200).json({ token });
    } catch (error) {
      next(error);
    }
  }

  async signupUser(req, res, next) {
    try {
      // sendVerificationMail({
      //   username: req.body.username,
      //   email: req.body.email
      // });
      // throw new Error("Not implemented");

      const user = await userService.createUser(req.body);

      const token = jwt.sign(
        {
          id: user._id,
          name: user.username,
          role: user.role,
          avatar: user.avatar
        }, // todo role
        process.env.JWT_SECRET
      );

      sendVerificationMail(user);

      return res.status(200).json({ token });
    } catch (error) {
      next(error);
    }
  }

  async revalidateUser(req, res, next) {
    try {
      console.log("revalidateUser", req.params.token);

      return res.status(200).json({ token });
    } catch (error) {
      next(error);
    }
  }

  async validateUser(req, res, next) {
    try {
      console.log("validateUser", req.params.token);

      let [user] = await userSchema.find({
        verificationToken: req.params.token
      });

      console.log("user", user);
      if (!user?._id) throw new BadRequestError("Invalid token");

      user = await userService.editDocumentById(
        user._id,
        userSchema,
        async (doc) => {
          doc.validated = true;
        }
      );

      console.log("user", user);

      return res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }

  testHtmlMail() {
    console.log({
      user: process.env.GMAIL_MAIL,
      pass: process.env.GMAIL_PW
    });

    const user = {
      username: "Thomas",
      email: "schmiddla@wsuxx.de",
      verificationToken: uuidv4()
    };

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.GMAIL_MAIL,
        pass: process.env.GMAIL_PW
      }
    });
    // const transporter = nodemailer.createTransport({
    //   service: "gmail",
    //   auth: {
    //     user: process.env.GMAIL_MAIL,
    //     pass: process.env.GMAIL_PW
    //   }
    // });

    const server = "https://yogalesson-creator.netlify.app/#";
    // const server = "https://yogalesson-createor-backend.herokuapp.com/auth";
    // const server = "http://localhost:3000";

    const mailOptions = {
      from: "your wbs-planansana team",
      to: user.email,
      subject: "Please verify your email to - Floating Ananas -",
      html: `<p style='font-style: italic'>Dear ${user.username}</p>
      <p style="font-style: italic">Please click this link to sell your soul: ${server}/validate/${user.verificationToken}</p>`
      // text: `Please click this link to sell your soul: ${server}/#/validate/${user.verificationToken}`
      // html: `<p>Please click this link to sell your soul:</p>
      // html: `<p style="font-style: bold">Dear ${user.username}</p>
      // </p style="font-style: italic">Please click this link to sell your soul: ${server}/auth/validate/${user.verificationToken}</p>`
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  }
}

function sendVerificationMail(user) {
  console.log({
    user: process.env.GMAIL_MAIL,
    pass: process.env.GMAIL_PW
  });

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: process.env.GMAIL_MAIL,
      pass: process.env.GMAIL_PW
    }
  });
  // const transporter = nodemailer.createTransport({
  //   service: "gmail",
  //   auth: {
  //     user: process.env.GMAIL_MAIL,
  //     pass: process.env.GMAIL_PW
  //   }
  // });

  const server = "https://yogalesson-creator.netlify.app/#";
  // const server = "https://yogalesson-createor-backend.herokuapp.com/auth";
  // const server = "http://localhost:3101";
  // const server = "http://localhost:3000";

  const mailOptions = {
    from: "Your Floating Ananas Team",
    to: user.email,
    subject: "Please verify your email to - Floating Ananas -",
    // text: `Please click this link to sell your soul: ${server}/#/validate/${user.verificationToken}`
    // html: `<p>Please click this link to sell your soul:</p>
    html: `</p stlye="font-style: italic">Please click this link to sell your soul: ${server}/validate/${user.verificationToken}</p>`
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}

export default new AuthController();
