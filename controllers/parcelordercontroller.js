const moment = require("moment");
const queries = require("../query");
const db = require("../database")

exports.placeParcelOrder = async (req,res)=>{
    const status = "pending"
const date = new Date();
const created_at = moment(date).format('YYYY-MM-DD HH:mm:ss');
const {sender_name, user_id, price, weight, location, destination, sender_note} = req.body; 
if (!sender_name || !user_id || !price || !weight || !location || !destination || !sender_note){
    res.status(404).json({
        message: "Please fill the necessary credentials"
    })
}
const queryObject = {
    text: queries.parcelOrderQuery,
    values: [sender_name, price, weight, location, destination, sender_note, created_at, created_at, user_id,status]
}
const {rowCount} = await db.query(queryObject);
try{
    if (rowCount===0){
        res.status(400).json({message:"could not create parcel order"})
    }
    if (rowCount > 0){
        res.status(201).json({message:"Your order has been placed"})
    }
}catch(error){
    res.status(500).json({message:"error creating parcel order"})
}
}
exports.getUserParcelByUserId = async (req,res)=>{
    const {user_id} = req.query
const queryObject = {
    text:queries.getUserOrderByUser,
    values:[user_id]
}
try{
    const {rows, rowCount} = await db.query(queryObject)
    if(rowCount > 0){
        return res.status(200).json({message:"This is your placed order", data:rows})
    }
    if(rowCount===0){
        return  res.status(400).json({message:"there is no user_id like this"})
    }
}
catch(error){
    console.log(error)
    res.status(400).json({message:"error finding username"})
}
}
exports.getUserParcelById = async (req,res)=>{
    console.log("got here5")
    const {id} = req.params
    if (!parseInt(id)) {
        return res.status(400).json({
            message: "Id must be an integer",
        });
    }
const queryObject = {
    text: queries.getUserOrderById,
    values:[id]
}
try{
    const {rows, rowCount} = await db.query(queryObject)
    if(rowCount > 0){
        return res.status(200).json({message:"This is your order by id", data:rows[0]}) // if u dont put d zero, it will show an array
    }
    if(rowCount===0){
        return  res.status(400).json({message:"there is no id found"})
    }
}
catch(error){
    res.status(400).json({message:"error finding id"})
}
}
exports.getAllParcelByAdmin = async (req,res)=>{
    console.log("got here")
    const queryObject = {
        text: queries.getAllParcelOrder,
    }
    try {
        const{rows,rowCount} = await db.query(queryObject)
        
        if (rowCount >0){
            return res.status(200).json({message:"fetched all parcel successfully", data:rows})
        }
        if(rowCount===0){
            return  res.status(200).json({data:rows})
        }
    } catch (error) {
        res.status(400).json({message:"error fetching all parcel"})
    }
}
exports.updateDestinationByUserId = async (req,res)=>{
    const {id} = req.params
    if (!parseInt(id)) {
        return res.status(400).json({
            message: "Id must be an integer",
        });
    }
    const { destination } = req.body;
    const d = new Date();
    const updated_at = moment(d).format("YYYY-MM-DD HH:mm:ss");
    const queryObject={
        text: queries.updateDestinationById,
        values:[ destination, updated_at, id]
    }
    const queryObject1 = {
        text: queries.getUserOrderById,
        values:[id]
    }
    try {
        const {rowCount,rows} = await db.query(queryObject1)
        if(rowCount === 0){
            return res.status(500).json({message:"parcel with id not found"})
        }
        if(rowCount > 0 && rows[0].status == "pending"){
            const {rowCount} = await db.query(queryObject);
            if(rowCount>0){
            return res.status(200).json({message:"parcel updated successfully"})
        }
        else{
            return res.status(400).json({message:"not updated"})
        }
    }
    else{
        return res.status(400).json({message:"cannot update a delivered parcel"})
    }
    } catch (error) {
        res.status(400).json({message:" an error occurred"})
    }
}

exports.updateLocationByIsAdmin = async (req,res)=>{
    const {user_id} = req.params
    if (!parseInt(user_id)) {
        return res.status(400).json({
            message: "Id must be an integer",
        });
    }
    const { location } = req.body;
    const d = new Date();
    const updated_at = moment(d).format("YYYY-MM-DD HH:mm:ss");
    const queryObject={
        text: queries.updateLocationByAdmin,
        values:[ location, updated_at, user_id]
    }
    
    try {
        const{rowCount} = await db.query(queryObject)
        if(rowCount === 0){
            return res.status(500).json({message:"parcel with id not found"})
        }
        if(rowCount > 0){
            return res.status(200).json({message:"parcel location updated successfully"})
        }
    } catch (error) {
        res.status(400).json({message:"error finding id"})
    }
}
exports.deleteParcelById = async (req,res)=>{
    const {id}= req.params;
    const queryObject = {
        text: queries.getUserOrderById,
        values:[id]
    }
    const queryObject1 = {
        text: queries.deleteParcelByUserId,
        values:[id]
    }
    try {
        let {rowCount,rows} = await db.query(queryObject);
        if (rowCount===0){
            return res.status(500).json({message:"parcel with id not found"})
        }
        
        if(rowCount > 0 && rows[0].status=='pending'){
            const {rowCount} = await db.query(queryObject1);
            if(rowCount>0){
                 res.status(200).json({message:"parcel deleted successfully"})
            }
            else{
                return res.status(400).json({message:"not deleted"})
            }
        }
        else{
            return res.status(400).json({message:"cannot delete a delivered parcel"})
        }
    } catch (error) {
        res.status(500).json({message:"error occurred"})
        console.log(error)
    }
}
exports.updateStatusByIsAdmin = async (req,res)=>{
const{id} = req.params;
const status='delivered'
const d = new Date();
    const updated_at = moment(d).format("YYYY-MM-DD HH:mm:ss");
const queryObject ={
    text:queries.updateStatus,
    values:[status, updated_at, id]
}
try {
    const{rowCount} = await db.query(queryObject)
    if(rowCount === 0){
        return res.status(500).json({message:"parcel with id not found"})
    }
    if(rowCount > 0){
        return res.status(200).json({message:"parcel status updated successfully"})
    }
} catch (error) {
    res.status(400).json({message:"error finding id"})
}
}