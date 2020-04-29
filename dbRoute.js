const express = require("express");
const router = express.Router();
const userController = require("./controllers/usercontroller");
const parcelordercontroller = require("./controllers/parcelordercontroller")
const verifyUserToken = require("./Validation/validations_bcrypt_jwt")
const { signUpUser, logInUser, isAdmin, isUser, signUpAdmin } = userController
const {placeParcelOrder, getUserParcelByUserId, getUserParcelById, updateDestinationByUserId, deleteParcelById, updateLocationByIsAdmin,getAllParcelByAdmin, updateStatusByIsAdmin} = parcelordercontroller
const {verifyToken,verifyTokenAdmin} = verifyUserToken


router.post('/auth/admin', signUpAdmin);
router.post('/auth/signup', signUpUser);
router.post('/auth/login', logInUser);
router.post('/parcel', verifyToken, isUser, placeParcelOrder);
router.get('/parcel/all',verifyTokenAdmin, getAllParcelByAdmin)
router.get('/parcel', getUserParcelByUserId);
router.get('/parcel/:id', getUserParcelById);
router.put('/parcel/destination/change/:id', updateDestinationByUserId)
router.delete('/parcel/cancel/:id', deleteParcelById)
router.put('/parcel/status/change/:id',verifyTokenAdmin, updateStatusByIsAdmin)
router.put('/parcel/location/change/:user_id', verifyTokenAdmin, updateLocationByIsAdmin)
module.exports = router
    