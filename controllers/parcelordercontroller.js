const moment = require("moment");
const queries = require("../query");
const db = require("../database")
const sendMail = require('../controllers/emailSenderController')



exports.placeParcelOrder = async (req, res) => {
    const status = "pending"
    const date = new Date();
    const created_at = moment(date).format('YYYY-MM-DD HH:mm:ss');
    const { sender_name, price, weight, location, destination, sender_note } = req.body;
    const user_id = req.user.id;
    if (!sender_name || !price || !weight || !location || !destination || !sender_note) {
        res.status(404).json({
            message: "Please fill the necessary credentials"
        })
    }
    const queryObject = {
        text: queries.parcelOrderQuery,
        values: [sender_name, price, weight, location, destination, sender_note, created_at, created_at, user_id, status]
    }
    const { rowCount } = await db.query(queryObject);
    try {
        if (rowCount === 0) {
            res.status(400).json({
                status: 'failure',
                code: 400,
                message: "could not create parcel order"
            })
        }
        if (rowCount > 0) {
            res.status(200).json({
                status: 'success',
                code: 200,
                message: "Your order has been placed"
            })
        }
    } catch (error) {
        res.status(500).json({
            status: 'failure',
            code: 400,
            message: "error creating parcel order"
        })
    }
}
exports.getUserParcelByUserId = async (req, res) => {
    const user_id = req.user.id
    const queryObject = {
        text: queries.getUserOrderByUser,
        values: [user_id]
    }
    try {
        const { rows, rowCount } = await db.query(queryObject)
        if (rowCount > 0) {
            return res.status(200).json({
                status: 'success',
                code: 200,
                message: "This is your placed order", data: rows[0]
            })
        }
        if (rowCount === 0) {
            return res.status(400).json({
                status: 'failure',
                code: 400,
                message: "there is no user_id like this"
            })
        }
    }
    catch (error) {
        console.log(error)
        res.status(400).json({
            status: 'failure',
            code: 400,
            message: "error finding username"
        })
    }
}
exports.getUserParcelById = async (req, res) => {
    const user_id = req.user.id
    const { id } = req.params
    if (!parseInt(id)) {
        return res.status(400).json({
            status: 'failure',
            code: 400,
            message: "Id must be an integer",
        });
    }
    const queryObject = {
        text: queries.getUserOrderById,
        values: [id, user_id]
    }
    try {
        const { rows, rowCount } = await db.query(queryObject)
        if (rowCount > 0) {
            return res.status(200).json({
                status: 'success',
                code: 200,
                message: "This is your order by id", data: rows
            }) // if u dont put d zero, it will show an array
        }
        if (rowCount === 0) {
            return res.status(400).json({
                status: 'failure',
                code: 400,
                message: "there is no id found"
            })
        }
    }
    catch (error) {
        console.log(error)
        res.status(400).json({
            status: 'failure',
            code: 400,
            message: "error finding id"
        })
    }
}
exports.getAllParcelByAdmin = async (req, res) => {
    console.log("got here")
    const queryObject = {
        text: queries.getAllParcelOrder,
    }
    try {
        const { rows, rowCount } = await db.query(queryObject)

        if (rowCount > 0) {
            return res.status(200).json({
                status: 'success',
                code: 200,
                message: "fetched all parcel successfully",
                data: rows
            })
        }
        if (rowCount === 0) {
            return res.status(200).json({ data: rows })
        }
    } catch (error) {
        res.status(400).json({
            status: 'failure',
            code: 400,
            message: "error fetching all parcel"
        })
    }
}
exports.updateDestinationByUserId = async (req, res) => {
    const user_id = req.user.id
    const { id } = req.params
    if (!parseInt(id)) {
        return res.status(400).json({
            status: 'failure',
            code: 400,
            message: "Id must be an integer",
        });
    }
    const { destination } = req.body;
    const d = new Date();
    const updated_at = moment(d).format("YYYY-MM-DD HH:mm:ss");
    const queryObject = {
        text: queries.updateDestinationById,
        values: [destination, updated_at, id, user_id]
    }
    const queryObject1 = {
        text: queries.getUserOrderById,
        values: [id, user_id]
    }
    try {
        const { rowCount, rows } = await db.query(queryObject1)
        if (rowCount === 0) {
            return res.status(400).json({
                status: 'failure',
                code: 400,
                message: "parcel with id not found"
            })
        }
        if (rowCount > 0 && rows[0].status == "pending") {
            const { rowCount } = await db.query(queryObject);
            if (rowCount > 0) {
                return res.status(200).json({
                    status: 'success',
                    code: 200,
                    message: "parcel updated successfully"
                })
            }
            else {
                return res.status(400).json({
                    status: 'failure',
                    code: 400,
                    message: "not updated"
                })
            }
        } else if (rowCount > 0 && rows[0].status == "transit") {
            return res.status(400).json({
                status: 'failure',
                code: 400,
                message: "cannot update a parcel in transit"
            })
        }
        else {
            return res.status(400).json({
                status: 'failure',
                code: 400,
                message: "cannot update a delivered parcel"
            })
        }
    } catch (error) {
        res.status(400).json({
            status: 'failure',
            code: 400,
            message: " an error occurred"
        })
    }
}

exports.updateLocationByIsAdmin = async (req, res) => {
    const { id } = req.params
    if (!parseInt(id)) {
        return res.status(400).json({
            message: "Id must be an integer",
        });
    }
    const { location } = req.body;
    const d = new Date();
    const updated_at = moment(d).format("YYYY-MM-DD HH:mm:ss");
    const queryObject = {
        text: queries.updateLocationByAdmin,
        values: [location, updated_at, id]
    }
    const queryObject1 = {
        text: queries.getStatus,
        values: [id]
    }

    try {
        const { rowCount, rows } = await db.query(queryObject1)
        if (rowCount > 0) {
            user_id = rows[0].user_id
            if (rows[0].status === "pending") {
                return res.status(400).json({
                    status: 'failure',
                    code: 400,
                    message: "The location of a parcel that is pending cannot be updated"
                })
            } else if (rows[0].status === "delivered") {
                res.status(400).json({
                    status: 'failure',
                    code: 400,
                    message: "cannot update a delivered parcel"
                })
            }
            else {
                const queryObject2 = {
                    text: queries.selectUserById,
                    values: [user_id]
                }
                const { rowCount } = await db.query(queryObject)
                if (rowCount === 0) {
                    return res.status(400).json({
                        status: 'failure',
                        code: 400,
                        message: "parcel with id not found"
                    })
                }
                if (rowCount > 0) {
                    const { rowCount, rows } = await db.query(queryObject2)
                    if (rowCount > 0) {
                        const email = rows[0].email
                        const subject = 'Location Modified to ' + location
                        const text = 'Your parcel location has been changed to ' + location + ' successfully!!'
                        await sendMail(email, subject, text)
                        res.status(200).json({
                            status: 'success',
                            code: 200,
                            message: "parcel updated successfully"
                        })
                    }
                }
            }
        }
        else {
            res.status(400).json({
                status: 'failure',
                code: 400,
                message: "parcel with id not found"
            })
        }
    } catch (error) {
        console.log(error)
        res.status(400).json({
            status: 'failure',
            code: 400,
            message: "error finding id"
        })
    }
}
exports.deleteParcelById = async (req, res) => {

    const { id } = req.params;
    // const user_id = req.user.id
    const queryObject = {
        text: queries.getStatus,
        values: [id]
    }
    const queryObject1 = {
        text: queries.deleteParcelByUserId,
        values: [id]
    }
    try {
        let { rowCount, rows } = await db.query(queryObject);
        console.log(rows)
        if (rowCount === 0) {
            return res.status(400).json({
                status: 'failure',
                code: 400,
                message: "parcel with id not found"
            })
        }
        if (rowCount > 0 && rows[0].status === 'pending') {
            console.log(queryObject1)
            const { rowCount } = await db.query(queryObject1);
            if (rowCount > 0) {
                res.status(200).json({
                    status: 'success',
                    code: 200,
                    message: "parcel deleted successfully"
                })
            }
            else {
                return res.status(400).json({
                    status: 'failure',
                    code: 400,
                    message: "not deleted"
                })
            }
        }
        else if (rowCount > 0 && rows[0].status == 'transit') {
            return res.status(400).json({
                status: 'failure',
                code: 400,
                message: "cannot delete a parcel in transit"
            })
        } else {
            return res.status(400).json({
                status: 'failure',
                code: 400,
                message: "cannot delete a delivered parcel"
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: 'failure',
            code: 400,
            message: "error occurred"
        })
    }
}
exports.updateStatusByIsAdmin = async (req, res, next) => {
    const { id } = req.params
    if (!parseInt(id)) {
        return res.status(400).json({
            status: 'failure',
            code: 400,
            message: "Id must be an integer",
        });
    }
    const { status } = req.body;
    if (status === "pending" || status === "transit" || status === "delivered") {
        const d = new Date();
        const updated_at = moment(d).format("YYYY-MM-DD HH:mm:ss");
        const queryObject1 = {
            text: queries.getStatus,
            values: [id]
        }
        const queryObject = {
            text: queries.updateStatus,
            values: [status, updated_at, id]
        }
        try {
            const { rowCount, rows } = await db.query(queryObject1)
            if (rowCount > 0) {
                user_id = rows[0].user_id
                if (rows[0].status === "delivered") {
                    return res.status(400).json({
                        status: 'failure',
                        code: 400,
                        message: "parcel is already delivered"
                    })
                } else {
                    const queryObject2 = {
                        text: queries.selectUserById,
                        values: [user_id]
                    }
                    const { rowCount } = await db.query(queryObject)
                    if (rowCount === 0) {
                        return res.status(400).json({
                            status: 'failure',
                            code: 400,
                            message: "parcel with id not found"
                        })
                    }
                    if (rowCount > 0) {
                        const { rowCount, rows } = await db.query(queryObject2)
                        if (rowCount > 0) {
                            const email = rows[0].email
                            const subject = 'Status Modified to ' + status
                            const text = 'Your parcel status has been changed to ' + status + ' successfully!!'
                            await sendMail(email, status, subject, text)
                            res.status(200).json({
                                status: 'success',
                                code: 200,
                                message: "parcel updated successfully"
                            })
                        }
                    }
                }
            } else {
                return res.status(400).json({
                    status: 'failure',
                    code: 400,
                    message: "parcel with id not found"
                })
            }
        } catch (error) {
            console.log(error)
            res.status(400).json({
                status: 'failure',
                code: 400,
                message: "error finding id"
            })
        }
    } else {
        res.status(400).json({ message: "This status is not the required value" })
    }
}