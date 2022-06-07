const Comment = require("../models/Comment");
const Place = require("../models/Place");
const decode = require("../services/decodeToken");

exports.create = async (req, res) => {
  const { place_id, message, rating } = req.body;

  try {
    const token = req.headers.authorization;

    const user = decode(token);
    console.log(place_id, message, rating, user.data.user_id);

    //get information of place
    const place_doc = await Place.findById(place_id).populate(["comments"]);
    console.log("place doc", place_doc.comments[0]);

    //create new block comment
    const doc = await Comment.create({
      message: message,
      user: user.data.user_id,
      place: place_id,
      rating: rating,
    });
    await doc.save();
    console.log("comment doc", doc);

    //append new comment to Place
    place_doc.comments.push(doc);

    //update total comment to Place
    place_doc.totalComment = place_doc.comments.length;

    //update total rating to Place
    let total_rating = 0;
    place_doc.comments.forEach((comment) => {
      total_rating = total_rating + comment.rating;
    });
    place_doc.averageRating = parseInt(total_rating / place_doc.totalComment);

    await place_doc.save();

    res.status(201).json({ success: true, data: place_doc });
  } catch (error) {
    res.status(400).json({ success: false, error: error });
  }
};

exports.update = (req, res) => {};

exports.delete = (req, res) => {};

exports.get_by_item = async (req, res) => {
  const { item_id } = req.params;

  try {
    const item_doc = await Item.findById(item_id).populate("comments");
    res.json({ success: true, data: item_doc.comments });
  } catch (error) {
    res.json({ success: false, error: error });
  }
};
