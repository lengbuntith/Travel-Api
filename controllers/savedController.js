const Saved = require("../models/Saved");
const Place = require("../models/Place");
const decode = require("../services/decodeToken");

const all = async (req, res) => {
  try {
    //get user id by token
    const token = req.headers.authorization;
    const user = decode(token);
    const user_id = user.data.user_id;

    //get only saved item that have user id
    const savedItems = await Saved.find({ user_id: user_id })
      .select({ _id: 1, place: 1 })
      .populate({
        path: "place",
        select: { _id: 1, title: 1, thumbnail: 1 },
      });

    res.status(200).json({ success: true, data: savedItems });
  } catch (error) {
    res.status(400).json({ success: false, error: error });
  }
};

const add = async (req, res) => {
  //get data from client
  const { place_id } = req.body;

  try {
    if (!place_id) {
      throw new Error("Required place_id");
    }

    //check if place is exist table Place
    await Place.findById(place_id);

    //get user id by token
    const token = req.headers.authorization;
    const user = decode(token);
    const user_id = user.data.user_id;

    //get all user saved items
    const savedItems = await Saved.find({ user_id: user_id }).populate("place");

    //check if user already own this Place id
    let isExist = false;

    savedItems.forEach((item) => {
      if (item.place._id == place_id) {
        isExist = true;
      }
    });

    if (isExist) {
      return res.status(400).json({ success: false, error: "Item is added" });
    }

    const doc = await Saved.create({
      user: user_id,
      user_id: user_id,
      place: place_id,
    });

    await doc.save();

    res.status(201).json({ success: true, data: doc });
  } catch (error) {
    res.status(400).json({ success: false, error: error });
  }
};

const delete_by_id = async (req, res) => {
  const { id } = req.params;

  try {
    //get user id by token
    const token = req.headers.authorization;
    const user = decode(token);
    const user_id = user.data.user_id;

    //get saved item from this id
    let savedItem = await Saved.findOne({ _id: id }).populate([
      "user",
      "place",
    ]);

    //check if item not found
    if (!savedItem) {
      return res.status(400).json({ success: false, error: "Item not found" });
    }

    //verify that user absolute own this saved
    if (savedItem.user._id != user_id) {
      return res
        .status(400)
        .json({ success: false, error: "User not own this saved item" });
    }

    //delete saved item
    const deleting = await Saved.deleteOne({ _id: id });
    res.status(200).json({ success: true, data: deleting });
  } catch (error) {
    res.status(400).json({ success: false, error: error });
  }
};

module.exports = {
  all,
  add,
  delete_by_id,
};
