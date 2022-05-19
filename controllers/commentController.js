const Comment = require("../models/Comment");
const Item = require("../models/Item");
const decode = require("../services/decodeToken");

exports.create = async (req, res) => {
  const { item_id, comment, rating } = req.body;

  try {
    const token = req.cookies.access_token;
    const user = decode(token);
    console.log(item_id, comment, rating, user.data.user_id);

    //get information of item
    const item_doc = await Item.findById(item_id);
    console.log("item doc", item_doc.comments[0]);

    //create new block comment
    const doc = await Comment.create({
      comment: comment,
      user: user.data.user_id,
      item: item_id,
      rating: rating,
    });
    await doc.save();
    console.log("comment doc", doc);

    //append new comment to item
    item_doc.comments.push(doc);
    await item_doc.save();

    res.json({ success: true, data: item_doc });
  } catch (error) {
    res.json({ success: false, error: error });
  }
};

exports.update = (req, res) => {};

exports.delete = (req, res) => {};

exports.get_by_item = (req, res) => {};
