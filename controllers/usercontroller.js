const moment = require("moment");
const queries = require("../query");
const db = require("../database");
const { hashPassword, generateToken, isValidEmail, validatePassword, comparePassword } = require("../Validation/validations_bcrypt_jwt");

exports.isAdmin = async (req, res, next) => {
    const { id } = req.params
    const queryObject = {
        text: queries.selectUserById,
        values: [id]
    }
    try {
        const { rowCount, rows } = await db.query(queryObject)
        console.log(rows)
        if (rowCount === 0) {
            res.status(400).json({
                status: 'failure',
                code: 400,
                message: "user does not exist"
            })
        }
        if (rowCount > 0) {
            if (rows[0].is_admin === false || rows[0].is_admin === null) {
                res.status(400).json({
                    status: 'failure',
                    code: 400,
                    message: "not an admin"
                })
            }
            else {
                next();
            }
        }
    } catch (error) {
        res.status(500).json({
            status: 'failure',
            code: 500,
            message: "error creating parcel order"
        })
    }

}
exports.isUser = async (req, res, next) => {
    console.log(req.user.id)
    const user_id = req.user.id
    const queryObject = {

        text: queries.selectUserById,
        values: [user_id]
    }
    console.log(queryObject)
    try {
        const { rowCount, rows } = await db.query(queryObject)
        console.log(rowCount);
        console.log(rows)
        if (rowCount === 0) {
            res.status(400).json({
                status: 'failure',
                code: 400,
                message: "user does not exist"
            })
        }
        if (rowCount > 0) {
            next();
        }
        else {
            res.status(400).json({
                status: 'failure',
                code: 400,
                message: "user does not exist"
            })
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: 'failure',
            code: 400,
            message: "error veryfying user"
        })
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
            status: 'failure',
            code: 400,
            message: "please put in a valid email"
        })
    }
    if (!validatePassword(password)) {
        return res.status(400).json({
            status: 'failure',
            code: 400,
            message: "Invalid Password"
        })
    }
    const hashedPassword = hashPassword(password)
    const admin_type = 'user';
    const queryObject = {
        text: queries.signUpUserQuery,
        values: [first_name, last_name, email, hashedPassword, state, created_at, created_at, admin_type]
    };
    try {
        const { rows } = await db.query(queryObject);
        const dbresponse = rows[0];
        delete dbresponse.password
        delete dbresponse.admin_type;
        delete dbresponse.created_at;
        const tokens = generateToken(dbresponse.id, dbresponse.first_name, dbresponse.last_name, dbresponse.email, dbresponse.state);
        const data = {
            token: tokens,
            dbresponse
        }
        res.status(201).json({
            status: 'success',
            code: 201,
            message: "User Created Successfully", data
        })
    } catch (error) {
        next(error);
    }
}
exports.signUpAdmin = async (req, res, next) => {
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
            status: 'failure',
            code: 400,
            message: "please put in a valid email"
        })
    }
    if (!validatePassword(password)) {
        return res.status(400).json({
            status: 'failure',
            code: 400,
            message: "Invalid Password"
        })
    }
    const hashedPassword = hashPassword(password)
    const admin_type = 'admin';
    const queryObject = {
        text: queries.signUpUserQuery,
        values: [first_name, last_name, email, hashedPassword, state, created_at, created_at, admin_type]
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
            status: "success",
            code: 201,
            message: "User Created Successfully", data
        })
    } catch (error) {
        next(error);
    }
}


exports.logInUser = async (req, res, next) => {
    const { email, password } = req.body
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
        const { rows } = await db.query(queryObject);
        dbresponse = rows[0]
        if (!dbresponse) {
            return res.status(400).json({
                status: 'failure',
                code: 400,
                message: "no user with this email found"
            })
        }
        if (!comparePassword(dbresponse.password, password)) {
            return res.status(400).json({
                status: 'failure',
                code: 400,
                message: "The Password is incorrect"
            })
        }

        const tokens = generateToken(dbresponse.id, dbresponse.first_name, dbresponse.last_name, dbresponse.email, dbresponse.state, dbresponse.admin_type);
        const data = {
            token: tokens
        }
        res.status(200).json({
            status: 'success',
            code: 200,
            message: "User logged in Successfully", data
        })
    } catch (error) {
        next(error);
    }
}
exports.updateAdminType = async (req, res) => {
    const { id } = req.params
    if (!parseInt(id)) {
        return res.status(400).json({
            message: "Id must be an integer",
        });
    }
    const { admin_type } = req.body;
    const d = new Date();
    const updated_at = moment(d).format("YYYY-MM-DD HH:mm:ss");
    const queryObject = {
        text: queries.updateTypeByAdmin,
        values: [admin_type, id]
    }
    try {
        const { rowCount } = await db.query(queryObject)
        if (rowCount === 0) {
            return res.status(500).json({ message: "parcel with id not found" })
        }
        if (rowCount > 0) {
            return res.status(200).json({ message: "parcel admintype updated successfully" })
        }
    } catch (error) {
        res.status(400).json({ message: "error finding id" })
    }
}
