const express = require("express");
const router = express.Router();
const userController = require("./controllers/usercontroller");
const parcelordercontroller = require("./controllers/parcelordercontroller")
const verifyUserToken = require("./Validation/validations_bcrypt_jwt")
const { signUpUser, logInUser, isAdmin } = userController
const {placeParcelOrder, getUserParcelByUserId, getUserParcelById, updateDestinationByUserId, deleteParcelById, updateLocationByIsAdmin} = parcelordercontroller
const {verifyToken} = verifyUserToken


router.post('/auth/signup', signUpUser);
router.post('/auth/login', logInUser);
router.post('/parcel', verifyToken, placeParcelOrder);
router.get('/parcel', getUserParcelByUserId);
router.get('/parcel/:id', getUserParcelById);
router.put('/parcel/destination/change/:id', updateDestinationByUserId)
router.delete('/parcel/cancel/:id', deleteParcelById)
router.put('/parcel/location/change/:id', isAdmin, updateLocationByIsAdmin)



router.get('/:id', isAdmin)
module.exports = router
    