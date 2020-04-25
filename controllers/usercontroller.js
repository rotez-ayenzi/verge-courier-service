const moment = require("moment");
const queries = require("../query");
const db = require("../database");
const { hashPassword, generateToken, isValidEmail, validatePassword, comparePassword } = require("../Validation/validations_bcrypt_jwt");

exports.isAdmin = async (req,res,next)=>{
    const {id} = req.params
    const queryObject={
        text: queries.selectUserById,
        values:[id]
    }
    try{
        const {rowCount, rows} = await db.query(queryObject)
        console.log(rows)
        if (rowCount===0){
            res.status(400).json({message:"user does not exist"})
        }
        if (rowCount > 0){
            if (rows[0].is_admin===false || rows[0].is_admin===null){
                res.status(400).json({message:"not an admin"})
            }
            else {
                next();
            }
        }
    }catch(error){
        res.status(500).json({message:"error creating parcel order"})
    }
    
}
exports.isUser = async (req,res,next)=>{
    const {id} = req.body
    const queryObject={
        text: queries.selectUserById,
        values:[id]
    }
    try{
        const {rowCount, rows} = await db.query(queryObject)
        console.log(rows)
        if (rowCount===0){
            res.status(400).json({message:"user does not exist"})
        }
        if (rowCount > 0){
            next();
        }
            else {
                res.status(400).json({message:"user does not exist"})
            }
        
    }catch(error){
        res.status(500).json({message:"error creating parcel order"})
    }
}
exports.signUpUser = async (req, res, next) => {
    const date = new Date();
    const created_at = moment(date).format('YYYY-MM-DD HH:mm:ss');
    const { first_name, last_name, email, password, state } = req.body;
    if (!first_name || !last_name || !email || !state || !password) {
        return res.status(400).json({
            message: "Please fill all fields",
        });
    }
    if (!isValidEmail(email)) {
        return res.status(400).json({
            message: "please put in a valid email"
        })
    }
    if (!validatePassword(password)) {
        return res.status(400).json({
            message: "Invalid Password"
        })
    }
    const hashedPassword = hashPassword(password)
    const isadmin = 0;
    const queryObject = {
        text: queries.signUpUserQuery,
        values: [first_name, last_name, email, hashedPassword, state, created_at, created_at, isadmin]
    };
    try {
        const { rows } = await db.query(queryObject);
        const dbresponse = rows[0];
        const tokens = generateToken(dbresponse.id, dbresponse.first_name, dbresponse.last_name, dbresponse.email, dbresponse.state);
        const data = {
            token: tokens,
            dbresponse
        }
        res.status(201).json({
            message: "User Created Successfully", data
        })
    } catch (error) {
        console.log(error)
        next(error);
    }
}

exports.logInUser = async (req,res,next) =>{
    const {email,password} = req.body
    if (!email || !password) {
        return res.status(400).json({
            message: "Please fill all fields",
        });
    }
    if (!isValidEmail(email)) {
        return res.status(400).json({
            message: "please put in a valid email"
        })
    }
    if (!validatePassword(password)) {
        return res.status(400).json({
            message: "Invalid Password"
        })
    }
    const queryObject = {
        text: queries.signInUserQuery,
        values: [email]
    };
try {
    const {rows} = await db.query(queryObject);
    dbresponse = rows[0]
    if (!dbresponse) {
    return res.status(400).json({
        message:"no user with this email found"
    })
    }
    if (!comparePassword(dbresponse.password, password)) {
        return res.status(400).json({
            message:"The Password is incorrect"
        })
      }
      
      const tokens = generateToken(dbresponse.id, dbresponse.first_name, dbresponse.last_name, dbresponse.email, dbresponse.state);
      const data = {
        token: tokens,
    
        dbresponse
    }
    res.status(201).json({
        message: "User logged in Successfully", data
    })
} catch (error) {
    console.log(error)
    next(error);
    }
}
