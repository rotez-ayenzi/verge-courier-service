const express = require("express");
const router = express.Router();
const userController = require("./controllers/usercontroller");
const parcelordercontroller = require("./controllers/parcelordercontroller")
const superadmincontroller = require("./controllers/superadmincontroller")
const verifyAllToken = require("./Validation/validations_bcrypt_jwt")
const { signUpUser, logInUser, isUser, signUpAdmin } = userController
const {updateUserBySuperAdmin} = superadmincontroller
const {placeParcelOrder, getUserParcelByUserId, getUserParcelById, updateDestinationByUserId, deleteParcelById, updateLocationByIsAdmin,getAllParcelByAdmin, updateStatusByIsAdmin} = parcelordercontroller
const {verifyToken,verifyTokenAdmin, verifyTokenSuperAdmin} = verifyAllToken


router.post('/auth/admin', signUpAdmin);
router.post('/auth/signup', signUpUser);
router.post('/auth/login', logInUser);
router.post('/parcel', verifyToken, isUser, placeParcelOrder);
router.get('/parcel/all',verifyTokenAdmin, getAllParcelByAdmin)
router.get('/parcel', verifyToken, getUserParcelByUserId);
router.get('/parcel/:id', verifyToken, getUserParcelById);
router.put('/parcel/destination/change/:id',verifyToken, updateDestinationByUserId)
router.put('/parcel/cancel/:id',verifyToken, deleteParcelById)
router.put('/parcel/status/change/:id', verifyTokenAdmin, updateStatusByIsAdmin)
router.put('/parcel/location/change/:id', verifyTokenAdmin, updateLocationByIsAdmin)
router.put('/parcel/admintype/change/:id', verifyTokenSuperAdmin, updateUserBySuperAdmin)
module.exports = router
    