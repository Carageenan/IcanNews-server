const { User, Customer } = require("../models/index");
const { validatePass } = require("../helpers/bcrypt");
const { makeTokenFromPayload } = require("../helpers/jwt");
const { OAuth2Client } = require("google-auth-library");

class authController {
  static async authRegis(req, res, next) {
    try {
      const { username, email, password, phoneNumber, address } = req.body;
      const createdAt = new Date();
      const updatedAt = new Date();
      const dataUser = await User.create({
        username,
        email,
        password,
        role: "Admin",
        phoneNumber,
        address,
        createdAt,
        updatedAt,
      });
      res.status(201).json({
        message: "register success",
        id: dataUser.id,
        email: dataUser.email,
      });
    } catch (err) {
      next(err);
    }
  }
  static async authCustRegis(req, res, next) {
    try {
      const { username, email, password, phoneNumber, address } = req.body;
      console.log(req.body);
      const createdAt = new Date();
      const updatedAt = new Date();
      const dataUser = await Customer.create({
        username,
        email,
        password,
        phoneNumber,
        address,
        createdAt,
        updatedAt,
      });
      res.status(201).json({
        message: "register success",
        id: dataUser.id,
        email: dataUser.email,
      });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
  static async authLogin(req, res, next) {
    try {
      const { email, password } = req.body;
      const hasAccount = await User.findOne({
        where: {
          email: email,
        },
      });
      if (!hasAccount) {
        throw {
          code: 401,
          name: "Unauthorized",
          message: "Invalid username or email or password",
        };
      }
      const validate = validatePass(password, hasAccount.password);
      if (!validate) {
        throw {
          code: 401,
          name: "Unauthorized",
          message: "Invalid username or email or password",
        };
      }

      const payload = {
        id: hasAccount.id,
        role: hasAccount.role,
      };

      const access_token = makeTokenFromPayload(payload);

      res.status(200).json({
        message: "Login successfull",
        username: hasAccount.username,
        role: hasAccount.role,
        id: hasAccount.id,
        access_token,
      });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
  static async authCustLogin(req, res, next) {
    try {
      const { email, password } = req.body;
      const hasAccount = await Customer.findOne({
        where: {
          email: email,
        },
      });
      if (!hasAccount) {
        throw {
          code: 401,
          name: "Unauthorized",
          message: "Invalid username or email or password",
        };
      }
      const validate = validatePass(password, hasAccount.password);
      if (!validate) {
        throw {
          code: 401,
          name: "Unauthorized",
          message: "Invalid username or email or password",
        };
      }

      const payload = {
        id: hasAccount.id,
        role: hasAccount.role,
      };

      const access_token = makeTokenFromPayload(payload);

      res.status(200).json({
        message: "Login successfull",
        username: hasAccount.username,
        id: hasAccount.id,
        access_token,
      });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
  static async authGoogle(req, res, next) {
    try {
      const { idToken } = req.body;
      const client = new OAuth2Client(process.env.Google_Client_Id);
      const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.Google_Client_Id,
      });
      const payload = ticket.getPayload();

      const dataUser = await User.findOne({
        where: {
          email: payload.email,
        },
      });
      let passingId;
      let passingUname;
      let passingRole;
      let access_token;
      if (!dataUser) {
        const createdAt = new Date();
        const updatedAt = new Date();
        const newUser = await User.create({
          username: payload.name.split(" ").join(""),
          email: payload.email,
          role: "Staff",
          password: "Default",
          createdAt,
          updatedAt,
        });
        const payloadToken = {
          id: newUser.id,
          role: newUser.role,
        };
        access_token = makeTokenFromPayload(payloadToken);
        passingId = newUser.id;
        passingUname = newUser.username;
        passingRole = newUser.role;
      } else {
        const payloadToken = {
          id: dataUser.id,
          role: dataUser.role,
        };
        access_token = makeTokenFromPayload(payloadToken);
        passingId = dataUser.id;
        passingUname = dataUser.username;
        passingRole = dataUser.role;
      }
      res.json({
        message: "Success authGoogle",
        access_token,
        username: passingUname,
        role: passingRole,
        id: passingId,
      });
    } catch (err) {
      next(err);
    }
  }
  static async authCustGoogle(req, res, next) {
    try {
      const { idToken } = req.body;
      const client = new OAuth2Client(process.env.Google_Client_Id);
      const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.Google_Client_Id,
      });
      const payload = ticket.getPayload();

      const dataUser = await Customer.findOne({
        where: {
          email: payload.email,
        },
      });
      let passingId;
      let passingUname;
      let passingRole;
      let access_token;
      if (!dataUser) {
        const createdAt = new Date();
        const updatedAt = new Date();
        const newUser = await Customer.create({
          username: payload.name.split(" ").join(""),
          email: payload.email,
          role: "Staff",
          password: "Default",
          createdAt,
          updatedAt,
        });
        const payloadToken = {
          id: newUser.id,
          role: newUser.role,
        };
        access_token = makeTokenFromPayload(payloadToken);
        passingId = newUser.id;
        passingUname = newUser.username;
        passingRole = newUser.role;
      } else {
        const payloadToken = {
          id: dataUser.id,
          role: dataUser.role,
        };
        access_token = makeTokenFromPayload(payloadToken);
        passingId = dataUser.id;
        passingUname = dataUser.username;
        passingRole = dataUser.role;
      }
      res.json({
        message: "Success authGoogle",
        access_token,
        username: passingUname,
        role: passingRole,
        id: passingId,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = authController;
