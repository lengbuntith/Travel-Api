const jwt = require("jsonwebtoken");
const User = require("../models/User");

const requireAuth = (req, res, next) => {
  const token = req.headers.authorization;
  // check json web token exists & is verified
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        console.log("requireAuth", err.message);
        res.status(401).json({ success: false, error: err.message });
      } else {
        console.log("requireAuth decoded token", decodedToken);
        next();
      }
    });
  } else {
    res.status(401).json({ success: false, error: "You need to login first" });
  }
};

// check current user
const checkUser = (req, res, next) => {
  const token = req.headers.authorization;
  console.log("middleware token", token);
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
      console.log("decoded", decodedToken);

      if (err) {
        res.locals.user = null;
        next();
      } else {
        let user = await User.findById(decodedToken.user_id);
        res.locals.user = user;
        console.log("middleware check user", user);
        res.json({ success: false, error: "This user is signed already" });
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};

const requireAuthAdmin = (req, res, next) => {
  const token = req.headers.authorization;
  // check json web token exists & is verified
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
      if (err) {
        console.log("requireAuthAdmin", err.message);
        res.send({ success: false, error: err.message });
      } else {
        try {
          console.log("requireAuth decoded token", decodedToken);
          let user = await User.findById(decodedToken.user_id);
          if (user.role === "admin") {
            next();
          } else {
            return res
              .status(500)
              .json({ success: false, error: "need admin login" });
          }
        } catch (error) {
          return res
            .status(500)
            .json({ success: false, error: "something went wrong" });
        }
      }
    });
  } else {
    res.send({ success: false, error: "You need to need admin login first" });
  }
};

module.exports = { requireAuth, checkUser, requireAuthAdmin };
