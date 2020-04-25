const bcrypt = require("bcrypt");
const dotenv = require ('dotenv');
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

  const generateToken = ( id, first_name, last_name, email,state) =>{
    const key = process.env.SECRET_KEY;
    const token = jwt.sign({ id, email, first_name, last_name, state }, key, { expiresIn: '1h' });
    return token;
  }

  const verifyToken = async (req, res, next)=>{
    const { token } = req.headers;
    if(!token){
        return res.status(400).send("token is not provided")
    }
    try{
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user={
            id : decoded.id,
            email: decoded.email,
            first_name: decoded.first_name,
            last_name : decoded.last_name,
            state: decoded.state
        }
        next();
    }catch(error){
        console.log(error)
        return res.status(400).send("Authentication Failed")
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
    verifyToken
}