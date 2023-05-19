const messages = require("../messages");
const Users = require("../schemas/userSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer"); /* New */

//create users

const registerUser = async (req, res) => {
  try {
    //check if user exists
    //const email=req.body.sEmail
    const { sEmail } = req.body;
    const userExsists = await Users.findOne({ sEmail });
    //console.log(Users)
    if (userExsists) {
      return res
        .status(messages.status.statusNotFound)
        .json(messages.messages.alreadyRegisteredUser);
    }
    //Hash Password
    else {
      const salt = await bcrypt.genSalt(10);
      const hasedPassword = await bcrypt.hash(req.body.sPassword, salt);
      //creating a user
      let users = await Users.create({
        sName: req.body.sName,
        sEmail: req.body.sEmail,
        sPassword: hasedPassword,
        sUsername: req.body.sUsername,
        nMobile: req.body.nMobile,
        sGender: req.body.sGender,
        // sProfilePhoto:req.file.path
      });
      if (users) {
        return res
          .status(messages.status.statusSuccess)
          .json({
            _id: users.id,
            data: users,
            token: generateToken(users._id),
          });
      } else {
        return res
          .status(messages.status.statusNotFound)
          .json(messages.messages.invalidCredentials);
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const loginUser = async (req, res) => {
  try {
    const { sEmail, sPassword } = req.body;
    const update = { isLoggedIn: true };
    let user = await Users.findOneAndUpdate({ sEmail }, update, {
      returnOriginal: false,
    });
    console.log(await bcrypt.compare(sPassword, user.sPassword));
    if (user && (await bcrypt.compare(sPassword, user.sPassword))) {
      console.log(user && (await bcrypt.compare(sPassword, user.sPassword)));
      return res
        .status(messages.status.statusSuccess)
        .json({ _id: user.id, sEmail: sEmail, token: generateToken(user._id) });
    } else {
      return res
        .status(messages.status.statusNotFound)
        .json(messages.messages.invalidCredentials);
    }
  } catch (error) {
    console.log(error);
  }
};
//Edit profile without password /* New */
const editProfile = async (req, res) => {
  try {
    const user = await Users.findById(req.params.id);
    console.log(user, "user");
    const id = req.params.id;
    console.log(id, "id");

    if (!user) {
      return res
        .status(messages.status.statusNotFound)
        .json(messages.messages.userNotFound);
    }

    if (req.body.sPassword || req.body.sEmail) {
      console.log(req.body.sPassword, "line 68");
      return res
        .status(messages.status.statusNotFound)
        .json(messages.messages.doNotChangeEmail);
    } else {
      const updatedUser = await Users.updateOne(
        { _id: id },
        {
          $set: {
            sName: req.body.sName,
            sUsername: req.body.sUsername,
            nMobile: req.body.nMobile,
            sGender: req.body.sGender,
          },
        },
        { returnOriginal: false }
      ).exec();
      console.log(user);
      return res.status(messages.status.statusSuccess).json(updatedUser);
    }
  } catch (error) {
    console.log(error);
  }
};
const deleteUser = async (req, res) => {
  try {
    const user = await Users.find();
    console.log(req.body, user);
    return res.status(messages.status.statusSuccess).json(Users);
  } catch (error) {
    console.log(error);
  }
};
const getLoggedinUser = async (req, res) => {
  try {
    /*imp lire*/ const { _id, sUsername, sEmail } = await Users.findById(
      req.users.id
    );
    return res
      .status(messages.status.statusSuccess)
      .json({ id: _id, sUsername, sEmail });
  } catch (error) {
    console.log(error);
  }
};

//Logout not workin properly /* New */
const logoutUser = async (req, res) => {
  try {
    const { sEmail, sPassword } = req.body;
    const update = { isLoggedIn: false };
    let user = await Users.findOneAndUpdate({ sEmail }, update, {
      returnOriginal: false,
    });
    console.log(user.sPassword);
    if (user && (await bcrypt.compare(sPassword, user.sPassword))) {
      res.cookie("jwt", "", { maxAge: 1 });
      return res.status(messages.status.statusSuccess).json(user);
    } else {
      return res
        .status(messages.status.statusNotFound)
        .json(messages.messages.invalidCredentials);
    }
  } catch (error) {
    console.log(error);
  }
};

//Changes password with old password   /* New */
const changePassword = async (req, res) => {
  try {
    const { sEmail, sPassword, sNewPassword } = req.body;

    const salt = await bcrypt.genSalt(10);
    const sNewPasswordHash = await bcrypt.hash(sNewPassword, salt);

    const updatedPassword = { sPassword: sNewPasswordHash };

    let user = await Users.findOne({ sEmail });

    if (user && (await bcrypt.compare(sPassword, user.sPassword))) {
      console.log(user);
      console.log(await bcrypt.compare(sPassword, user.sPassword));
      let updatedUser = await Users.updateOne({ sEmail }, updatedPassword, {
        returnOriginal: false,
      }).exec();
      console.log(updatedUser);
      return res
        .status(messages.status.statusSuccess)
        .json({ message: "Password updated successfully", user: user });
    } else {
      console.log("hi");
      return res
        .status(messages.status.badrequest)
        .json(messages.messages.wrongpass);
    }
  } catch (error) {
    console.log(error);
  }
};
//Change password with mail and without old password /* New */
const forgotPassword = async (req, res) => {
  try {
    const { sEmail } = req.body;
    const link = process.env.BASE_URL;
    const user = await Users.find({ sEmail });
    console.log(user);
    if (user === null) {
      return res
        .status(messages.status.statusNotFound)
        .json(messages.messages.loginEmailNotRegistered);
    } else {
      const transport = nodemailer.createTransport({
        service: "gmail",
        auth: {
          type: "custom",
          user: process.env.ADMIN_MAIL,
          pass: process.env.ADMIN_PASSWORD,
        },
      });

      const mailOptions = {
        from: process.env.ADMIN_MAIL,
        to: sEmail,
        subject: "Forgot Password",
        text: "This is a link to reset password \n " + link,
      };

      transport.sendMail(mailOptions, function (error, info) {
        if (error) console.log(error);
        else console.log("email sent" + info.response);
      });

      console.log("hi");
      return res
        .status(messages.status.statusSuccess)
        .json({ message: "Mail Sent" });
    }
  } catch (error) {
    console.log(error);
  }
};
//it is a redirect url from above /* New */
const resetPassword = async (req, res) => {
  try {
    const { sEmail, sNewPassword } = req.body;
    const user = await Users.findOne({ sEmail });
    if (!user) {
      return res
        .status(messages.status.statusNotFound)
        .json(messages.messages.loginEmailNotRegistered);
    } else {
      const salt = await bcrypt.genSalt(10);
      const sNewPasswordHash = await bcrypt.hash(sNewPassword, salt);
      let updatedUser = await Users.updateOne(
        { sEmail },
        { sPassword: sNewPasswordHash },
        { returnOriginal: false }
      ).exec();
      console.log(updatedUser);
      return res
        .status(messages.status.statusSuccess)
        .json({
          message: "Your password has been reset successfully",
          user: user,
        });
    }
  } catch (error) {
    console.log(error);
  }
};
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "3d" });
};

module.exports = {
  registerUser,
  loginUser,
  editProfile,
  deleteUser,
  getLoggedinUser,
  logoutUser,
  changePassword,
  forgotPassword,
  resetPassword,
  generateToken,
};
