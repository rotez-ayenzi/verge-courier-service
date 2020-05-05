const moment = require("moment");
const queries = require("../query");
const db = require("../database")

exports.updateUserBySuperAdmin = async (req, res, next) => {
    const { id } = req.params
    if (!parseInt(id)) {
        return res.status(400).json({
            status: 'failure',
            code: 400,
            message: "Id must be an integer",
        });
    }
    const { admin_type } = req.body;
    const d = new Date();
    const updated_at = moment(d).format("YYYY-MM-DD HH:mm:ss");
    const queryObject = {
        text: queries.updateAdminType,
        values: [admin_type, updated_at, id]
    }

    try {
        const { rowCount } = await db.query(queryObject)
        if (rowCount === 0) {
            return res.status(400).json({
                status: 'failure',
                code: 400,
                message: "parcel with id not found"
            })
        }
        if (rowCount > 0) {
            return res.status(200).json({
                status: 'success',
                code: 200,
                message: "user admin type updated successfully"
            })
        }
    } catch (error) {
        res.status(400).json({
            status: 'failure',
            code: 400,
            message: "error finding id"
        })
    }
}