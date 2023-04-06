const User = require('../models/User');
const decoded = require("../services/decodeToken");
const chatController = require("./chatController");

const createContact = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const decrypted = decoded(token);
    const currentUser = decrypted.data.user_id;

    const { email } = req.body;

    //get current user data
    const currentUserDoc = await User.findById(currentUser);
    const { contacts } = currentUserDoc;
    
    //validate
    if(!email) return res.status(404).json({error: 'Email is required'})

    //prevent add own account
    if(currentUserDoc.email == email) return res.status(404).json({error: 'Can not add your own email'})

    //find email is user is exist in db
    const newContact = await User.findOne({email});
    console.log('new contact', newContact);
    if(!newContact) return res.status(404).json({error: 'Email is incorrect'})

    //find is contact is exist
    console.log('contacts', contacts)
    let exist = false;
    contacts.some((c) => {
        if(c.email == newContact.email) {
            exist = true;
            return;
        }
    })
    console.log('contact exist status: ', exist)
    if(exist) return res.status(404).json({error: 'User is existed in contact'})

    // Add the contact to the current user's contacts array
    const updatedUser = await User.findByIdAndUpdate(
      currentUser,
      { $push: { contacts: { userId: newContact._id, email: newContact.email } } },
      { new: true }
    );

    //create new chat

    res.status(200).json(updatedUser.contacts);
  } catch (error) {
    console.error(error)
    res.status(501).json({ error: 'Something Went Wrong'})
  }
};

const getAllContacts = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const decrypted = decoded(token);
    const currentUser = decrypted.data.user_id;
    const user = await User.findById(currentUser);

    res.status(200).json(user.contacts);
  } catch (error) {
    console.error(error)
    res.status(501).json({ error: 'Something Went Wrong'})
  }
};

const getContactById = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const decrypted = decoded(token);
    const currentUser = decrypted.data.user_id;
    const contactId = req.params.id;
    const user = await User.findById(currentUser);

    const contact = user.contacts.find((c) => c.userId.toString() === contactId);
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    res.status(200).json(contact);
  } catch (error) {
    console.error(error)
    res.status(501).json({ error: 'Something Went Wrong'})
  }
};

const updateContact = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const decrypted = decoded(token);
    const currentUser = decrypted.data.user_id;
    const contactId = req.params.id;
    const { username, email } = req.body;

    const existingContact = await User.findOne({ email });
    if (existingContact && existingContact._id.toString() !== contactId) {
      return res.status(400).json({ error: 'Contact with this email already exists' });
    }

    const updatedContact = await User.findByIdAndUpdate(
      contactId,
      { username, email },
      { new: true }
    );

    const user = await User.findById(currentUser);
    const contactIndex = user.contacts.findIndex((c) => c.userId.toString() === contactId);
    if (contactIndex === -1) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    user.contacts[contactIndex] = { userId: updatedContact._id, username: updatedContact.username };
    await user.save();

    res.status(200).json(updatedContact);
  } catch (error) {
    console.error(error)
    res.status(501).json({ error: 'Something Went Wrong'})
  }
};

module.exports = {
    createContact,
    getAllContacts,
    getContactById,
    updateContact
}