const asyncHandler = require("express-async-handler");
const { Contact } = require("../models/contactModel");
const csv = require("csv-express");

//create new contacts
const addContact = asyncHandler(async (req, res) => {
  const { name, phone } = req.body;
  const image = req.file ? req.file.path : null;
  try {
    const numberExist = await Contact.findOne({ phone: phone });
    if (numberExist) {
      res.status(400).json("number already added")  
    }
    const newContact = await Contact.create({
      name,
      phone,
      image,
    });
    if (newContact) {
      res.status(200).json({
        _id: newContact._id,
        name: newContact.name,
        phone: newContact.phone,
        image: newContact.image,
      });
    } else {
      res.status(400);
      throw new Error("error occured");
    }
  } catch (error) {
   console.log("some error occured")
  }

});

//get all created contacts
const getAllContacts = asyncHandler(async(req,res)=>{
  try {
    const allContacts = await Contact.find({});
    if (allContacts) {
      res.status(200).json(allContacts);
    } else {
      res.status(400).json("unable to fetch contacts");
    }
  } catch (error) {
    res.json({message:"error ocuured"})
  }
    
})

//delete contact
const deleteContact = asyncHandler(async(req,res)=>{
  try {
    const { id } = req.params;
    console.log(id, "id");
    return await Contact.deleteOne({ _id: id })
      .then((response) => {
        res.status(200).json(response);
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (error) {
    res.json({message:"unable to delete contact"})
  }
    
})

//update a contact
const updateContact = asyncHandler(async(req,res)=>{
  try {
    const { id } = req.params;
    const image = req.file ? req.file.path : null;
    const updateData = {
      name: req.body.name,
      phone: req.body.phone,
      image: image,
    };
    const update = await Contact.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
    if (update) {
      res.status(200).json(update);
    } else {
      res.status(400).json({ success: false });
    }
  } catch (error) {
    res.json({message:"unable to update contact"})
  }
  
})


//search contact by name or phone
const searchContact = asyncHandler(async(req,res)=>{
  try {
    const searchData = req.query.name?req.query.name:req.query.phone
    const searchResult = await Contact.find({
      $or:[
        {name:{$regex:`${searchData}`,$options:"i"}},
        {phone:{$regex:`${searchData}`,$options:"i"}}
      ]
    })
    return res.status(200).json({message:"The search result",searchResult})
  } catch (error) {
    res.status(400).json({message:"unable to find results"})
  }
})

//export to csv 
const exportcsv = asyncHandler(async (req, res) => {
  const filename = "contacts.csv"
  Contact.find({}).lean().exec({},function(err,contacts){
    if (err) res.json(err);
    res.csv(contacts, true);
  })
});



module.exports = {
  addContact,
  getAllContacts,
  deleteContact,
  updateContact,
  searchContact,
  exportcsv,
};
