const User = require("../models/User");
const jwt = require("jsonwebtoken");
const decoded = require("../services/decodeToken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const sendEmail = require("../services/sendEmail");

// handle errors
const handleErrors = (err) => {
  console.log("handleErrors", err.message, err.code);

  let errors = {};

  // incorrect email
  if (err.message.includes("incorrect email")) {
    errors.email = "That email is not registered or incorrect";
  }

  // incorrect password
  if (err.message.includes("incorrect password")) {
    errors.password = "That password is incorrect";
  }

  // required password
  if (err.message.includes("Please enter password")) {
    errors.password = "Password is Required";
  }

  // duplicate email error
  if (err.code === 11000) {
    if (err.keyPattern.email) errors.email = "that email is already registered";
    if (err.keyPattern.username)
      errors.username = "that username is already registered";
  }

  // validation errors
  if (err.message.includes("User validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  console.log("res handle error", errors);

  return errors;
};

//create token
const createToken = (user_id) => {
  return jwt.sign({ user_id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

//login
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    //user logging...
    const user = await User.login(email, password);
    //generate token
    const token = createToken(user._id);
    //store cookie
    //res.cookie("access_token", token);
    //response data
    res.status(200).json({ success: true, token, data: user });
  } catch (err) {
    console.log("error login", err);
    const error = handleErrors(err);
    res.status(400).json({ success: false, error: error });
  }
};

//register
const register = async (req, res) => {
  try {
    const user = await User.create(req.body);
    console.log("register", user);
    res.status(201).json({ success: true, data: user });
  } catch (err) {
    console.log("error register", err);
    const error = handleErrors(err);
    res.status(400).json({ success: false, error: error });
  }
};

//get user
const get_user = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, error: error });
  }
};

//logout account
const logout = (req, res) => {
  // res.clearCookie("access_token");
  res.status(200).json({ success: true });
};

//get me
const get_me = async (req, res) => {
  //get token
  const token = req.headers.authorization;

  console.log(token);

  //decoded token to get user_id
  jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
    console.log("requireAuth decoded token", decodedToken);
    let user = await User.findById(decodedToken.user_id);
    res.status(200).json({ success: true, data: user });
  });
};

//update user info
const update_user = async (req, res) => {
  //get body
  const body = req.body;
  //get token
  const token = req.headers.authorization;
  //decode token
  const user = decoded(token);
  console.log("user ", user);

  if (user.success) {
    const doc = await User.findById(user.data.user_id);
    if (body.firstName) doc.firstName = body.firstName;
    if (body.lastName) doc.lastName = body.lastName;
    if (body.imageUrl) doc.imageUrl = body.imageUrl;

    await doc.save();
    res.status(200).json({ success: true, data: doc });
  }
};

//update account password
const update_password = async (req, res) => {
  try {
    let { password, newPassword } = req.body;

    if (!password) {
      return res.json({ success: false, error: "Password is Required" });
    }

    if (!newPassword) {
      return res.json({ success: false, error: "New password is Required" });
    }

    if (newPassword.length < 8) {
      return res.json({
        success: false,
        error: "Minimum new password is 8 characters",
      });
    }

    //get token
    const token = req.headers.authorization;
    //decrypt token
    const decrypted = decoded(token);

    if (decrypted.success) {
      //get user info
      const user = await User.findById(decrypted.data.user_id);

      //compare req password with user password
      const auth = await bcrypt.compare(password, user.password);

      //password is matched
      if (auth) {
        //if old and new pass is same not allow to change
        const isSame = await bcrypt.compare(newPassword, user.password);

        if (isSame) {
          return res.json({
            success: false,
            error: "this new password is same with old password",
          });
        }

        //encrypt password
        user.password = newPassword;
        await user.save();

        const new_token = createToken(user._id);

        res.json({ success: true, token: new_token, data: user });
      } else {
        res.json({ success: false, error: "Incorrect Password" });
      }
    }
  } catch (error) {
    res.json({ success: false, error: error });
  }
};

//delete user account
const delete_user = async (req, res) => {
  const token = req.headers.authorization;

  const decrypted = decoded(token);

  if (decrypted.success == false) {
    return res.json({ success: false, error: "token is invalid" });
  }

  //delete user
  try {
    const delete_res = await User.deleteOne({ _id: decrypted.data.user_id });
    console.log("delete user", delete_res);

    res.json({ success: true, data: delete_res });
  } catch (error) {
    res.json({ success: false, error: error });
  }
};

//admin login
const admin_login = async (req, res) => {
  const { email, password } = req.body;
  try {
    //user logging...
    const user = await User.login(email, password);

    if (user.role === "admin") {
      //generate token
      const token = createToken(user._id);
      //store cookie
      // res.cookie("access_token", token);
      return res.status(200).json({ success: true, token: token, data: user });
    } else {
      return res.status(500).json({ success: false });
    }
  } catch (err) {
    console.log("error login", err);
    const error = handleErrors(err);
    res.status(400).json({ success: false, error: error });
  }
};

//forgot password
const forgot_password = async (req, res) => {
  // 1) Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });

  //if email is not registered
  if (!user) {
    return res.status(400).json({ success: false, error: "User not found" });
  }

  // 2) Generate the random reset token
  const resetToken = await user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) Send url to user
  const resetURL = `http:/localhost:3000/forgot?token=${resetToken}`;

  //send email
  const sendMail = await sendEmail(user.email, "forgot password", resetURL);
  console.log("send mail", sendMail);

  //response to client
  res.status(200).json({ success: true });
};

//check reset expired
const check_reset_expire = async (req, res) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    return res
      .status(400)
      .json({ success: false, error: "Token is invalid or has expired" });
  } else {
    return res.status(200).json({ success: true });
  }
};

//reset password
const reset_password = async (req, res) => {
  try {
    // 1) Get user based on the token
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    // 2) If token has not expired, and there is user, set the new password
    if (!user) {
      return res.status(400).json({
        success: false,
        error: { token: "Token is invalid or has expired" },
      });
    }

    //update user password
    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;

    //remove these 2 field to prevent reset password again
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    //login user
    const token = createToken(user._id);
    // res.cookie("access_token", token);
    res.status(200).json({ success: true, token, data: user });
  } catch (error) {
    const errors = handleErrors(error);
    res.status(400).json({ success: false, error: errors });
  }
};

module.exports = {
  login,
  register,
  get_user,
  logout,
  get_me,
  update_user,
  update_password,
  delete_user,
  admin_login,
  forgot_password,
  reset_password,
  check_reset_expire,
};
