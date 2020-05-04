const bcrypt = require("bcrypt");
const dotenv = require('dotenv');
const jwt = require("jsonwebtoken");

dotenv.config();


const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);
const hashPassword = password => bcrypt.hashSync(password, salt);

const isValidEmail = (email) => {
  const regEx = /\S+@\S+\.\S+/;
  return regEx.test(email);
};

const validatePassword = (password) => {
  if (password.length <= 5) {
    return false;
  } return true;
};

const generateToken = (id, first_name, last_name, email, state, admin_type) => {
  const key = process.env.SECRET_KEY;
  const token = jwt.sign({ id, email, first_name, last_name, state, admin_type }, key, { expiresIn: '1h' });
  return token;
}

const verifyToken = async (req, res, next) => {
  const { token } = req.headers;
  if (!token) {
    return res.status(403).json({
      status: "failure",
      code: 403,
      message: "token is not provided"
    })
  }
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded
    console.log(req.user)
    next();
  } catch (error) {
    console.log(error)
    return res.status(401).json({
      status: 'failure',
      code: 400,
      message: "You are not authorised"
    })
  }
}
const verifyTokenAdmin = async (req, res, next) => {
  const { token } = req.headers;
  if (!token) {
    return res.status(403).json({
      status: 'failure',
      code: 403,
      message: "token is not provided"
    })
  }
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded
    if (decoded.admin_type === "user" || decoded.admin_type === "Super Admin") {
      return res.status(400).json({
        status: 'failure',
        code: 400,
        message: "You are not Authorised to Perform this Operation"
      })
    }
    next();
  } catch (error) {
    console.log(error)
    return res.status(400).json({
      status: 'failure',
      code: 400,
      message: "Authentication Failed"
    })
  }
}
const verifyTokenSuperAdmin = async (req, res, next) => {
  const { token } = req.headers;
  if (!token) {
    return res.status(403).json({
      status: "failure",
      code: 403,
      message: "token is not provided"
    })
  }
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded
    if (decoded.admin_type !== "Super Admin") {
      return res.status(400).json({
        status: 'failure',
        code: 400,
        message: "You cannot create an admin"
      })
    }
    next();
  } catch (error) {
    console.log(error)
    return res.status(400).json({
      status: 'failure',
      code: 400,
      message: "Authentication Failed"
    })
  }
}

const comparePassword = (hashedPassword, password) => {
  return bcrypt.compareSync(password, hashedPassword);
};

module.exports = {
  hashPassword,
  isValidEmail,
  validatePassword,
  generateToken,
  comparePassword,
  verifyToken,
  verifyTokenAdmin,
  verifyTokenSuperAdmin
}