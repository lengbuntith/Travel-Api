const City = require("../models/City");

exports.get_all = async (req, res) => {
  try {
    const all = await City.find();
    res.status(200).json({ success: true, data: all });
  } catch (error) {
    res.status(500).json({ success: false, error: error });
  }
};

exports.create_new = async (req, res) => {
  try {
    const doc = await City.create(req.body);
    await doc.save();

    res.json({ success: true, data: doc });
  } catch (error) {
    res.json({ success: false, error: error });
  }
};
