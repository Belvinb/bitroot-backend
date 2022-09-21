const express = require('express');
const { addContact, getAllContacts, deleteContact, updateContact, searchContact, exportcsv } = require('../controllers/contactController');
const {upload} = require("../utils/cloudinary")
const router = express.Router()


//create new contact
router.post("/addContact", upload.single("image"), addContact);

//get all contacts
router.get("/getAllContacts", getAllContacts);

//delete contact 
router.delete("/deleteContact/:id", deleteContact);

//update contact
router.patch("/updateContact/:id", upload.single("image"), updateContact);

//search contact
router.post("/searchContact", searchContact);

//export to csv
router.get("/exportcsv", exportcsv);


module.exports = router