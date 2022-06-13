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
  console.log("get item");
  const { place_id } = req.params;

  try {
    const item_doc = await Place.findById(place_id).populate("comments");

    let rating = [
      {
        _id: 1,
        title: "Exellent",
        value: 0,
        count: 0,
      },
      {
        _id: 2,
        title: "Very Good",
        value: 0,
        count: 0,
      },
      {
        _id: 3,
        title: "Average",
        value: 0,
        count: 0,
      },
      {
        _id: 4,
        title: "Poor",
        value: 0,
        count: 0,
      },
      {
        _id: 5,
        title: "Terible",
        value: 0,
        count: 0,
      },
    ];

    item_doc.comments.forEach((comment) => {
      if (comment.rating == 5) {
        rating[0].count++;
      } else if (comment.rating == 4) {
        rating[1].count++;
      } else if (comment.rating == 3) {
        rating[2].count++;
      } else if (comment.rating == 2) {
        rating[3].count++;
      } else if (comment.rating == 1) {
        rating[4].count++;
      }
    });

    rating[0].value = rating[0].count / item_doc.totalComment;
    rating[1].value = rating[1].count / item_doc.totalComment;
    rating[2].value = rating[2].count / item_doc.totalComment;
    rating[3].value = rating[3].count / item_doc.totalComment;
    rating[4].value = rating[4].count / item_doc.totalComment;

    console.log("rating", rating);

    res.json({ success: true, data: item_doc.comments, rating });
  } catch (error) {
    res.json({ success: false, error: error });
  }
};
