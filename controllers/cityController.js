const City = require("../models/City");

exports.get_all = async (req, res) => {
  try {
    const all = await City.find();
    res.status(200).json({ success: true, data: all });
  } catch (error) {
    res.status(500).json({ success: false, error: error });
  }
};

exports.by_id = async (req, res) => {
  const { id } = req.params;

  try {
    const doc = await City.findById(id);
    res.status(200).json({ success: true, data: doc });
  } catch (error) {
    res.status(400).json({ success: false, error: error });
  }
};

exports.create_new = async (req, res) => {
  try {
    const doc = await City.create(req.body);
    await doc.save();

    res.status(200).json({ success: true, data: doc });
  } catch (error) {
    res.status(400).json({ success: false, error: error });
  }
};

exports.update_by_id = async (req, res) => {
  const { id } = req.params;
  const { name, description, thumbnail } = req.body;

  try {
    const doc = await City.findById(id);
  
    if (name) doc.name = name;
    if (description) doc.description = description;
    if (thumbnail) doc.thumbnail = thumbnail;

    await doc.save();
    res.status(200).json({ success: true, data: doc });
  } catch (error) {
    res.status(400).json({ success: false, error: error });
  }
};

exports.delete_by_id = async (req, res) => {
  const { id } = req.params;
  try {
    const deleting = await City.deleteOne({ _id: id });
    res.status(200).json({ success: true, data: deleting });
  } catch (error) {
    res.status(400).json({ success: false, error: error });
  }
};
