const Contact = require("../model/contactModel");
const { isValidObjectId } = require("mongoose");

// Handle index actions
exports.index = (_, res) => {
  Contact.get((err, contacts) => {
    if (err) {
      return res.status(404).json({
        status: "error",
        message: err,
      });
    }
    res.status(200).json({
      status: "success",
      message: "Contacts retrieved successfully",
      data: contacts,
    });
  });
};

// Handle create contact actions
exports.new = (req, res) => {
  if (!req.body.name || !req.body.email) {
    return res.status(400).json({
      status: "error",
      message: "Missing name/email!",
    });
  }
  var contact = new Contact();
  contact.name = req.body.name ? req.body.name : contact.name;
  contact.gender = req.body.gender;
  contact.email = req.body.email;
  contact.phone = req.body.phone;
  // save the contact and check for errors
  contact.save((err) => {
    if (err) {
      return res.json({
        status: "error",
        message: err,
      });
    }
    res.json({
      status: "success",
      message: "New contact created!",
      data: contact,
    });
  });
};

// Handle view contact info
exports.view = (req, res) => {
  if (!isValidObjectId(req.params.contact_id)) {
    return res.status(400).json({
      status: "error",
      message: "invalid contact_id!",
    });
  }
  Contact.findById(req.params.contact_id, (err, contact) => {
    if (err || !contact) {
      return res.status(404).json({
        status: "error",
        message: "cannot find contact with contact_id " + req.params.contact_id,
      });
    }
    res.status(200).json({
      status: "success",
      message: "Contact details loading..",
      data: contact,
    });
  });
};

// Handle update contact info
exports.update = (req, res) => {
  if (!isValidObjectId(req.params.contact_id)) {
    return res.status(400).json({
      status: "error",
      message: "invalid contact_id!",
    });
  }
  Contact.findById(req.params.contact_id, (err, contact) => {
    if (err || !contact) {
      return res.status(404).json({
        status: "error",
        message: "cannot find contact with contact_id " + req.params.contact_id,
      });
    }
    contact.name = req.body.name ? req.body.name : contact.name;
    contact.email = req.body.email ? req.body.email : contact.email;
    contact.gender = req.body.gender ? req.body.gender : contact.gender;
    contact.phone = req.body.phone ? req.body.phone : contact.phone;
    // save the contact and check for errors
    contact.save((err) => {
      if (err) res.json(err);
      res.status(200).json({
        status: "success",
        message: "Contact Info updated",
        data: contact,
      });
    });
  });
};

// Handle delete contact
exports.delete = (req, res) => {
  if (!isValidObjectId(req.params.contact_id)) {
    return res.status(400).json({
      status: "error",
      message: "invalid contact_id!",
    });
  }
  Contact.deleteOne(
    {
      _id: req.params.contact_id,
    },
    (err) => {
      if (err) {
        return res.status(404).json({
          status: "error",
          message:
            "cannot find contact with contact_id " + req.params.contact_id,
        });
      }
      res.json({
        status: "success",
        message: "Contact deleted",
      });
    }
  );
};
