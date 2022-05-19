const jwt = require("jsonwebtoken");

const decoded = (token) => {
  let result = "";
  jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
    console.log("decoded token", decodedToken);
    if (err) {
      result = { success: false, error: err };
    } else {
      result = { success: true, data: decodedToken };
    }
  });

  return result;
};

module.exports = decoded;
