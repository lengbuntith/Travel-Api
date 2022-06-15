const Comment = require("../models/Comment");
const Place = require("../models/Place");
const decode = require("../services/decodeToken");
const User = require("../models/User");

exports.create = async(req, res) => {
    const { place_id, message, rating } = req.body;

    try {
        const token = req.headers.authorization;

        const user = decode(token);
        console.log(place_id, message, rating, user.data.user_id);

        //get user information
        const user_info = await User.findById(user.data.user_id);
        console.log("user ", user_info);

        //get information of place
        const place_doc = await Place.findById(place_id).populate(["comments"]);
        console.log("place doc", place_doc.comments[0]);

        //check if user already commented
        let userIndex = place_doc.comments.findIndex((user) => {
            return user.userId == user_info._id;
        });

        console.log("user index", userIndex);

        if (userIndex != -1) {
            return res.status(400).json({
                success: false,
                error: "You already commented",
            });
        }

        //create new block comment
        const doc = await Comment.create({
            message: message,
            place: place_id,
            rating: rating,
            userId: user_info._id,
            userImageUrl: user_info.imageUrl,
            userFirstName: user_info.firstName,
            userLastName: user_info.lastName,
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

exports.delete = async(req, res) => {
    const { comment_id } = req.params;

    try {
        const token = req.headers.authorization;
        const user = decode(token);

        //get comment info
        const comment_info = await Comment.findById(comment_id);

        //check if comment is owned by this user id
        if (comment_info.userId != user.data.user_id) {
            return res.status(400).json({
                success: false,
                error: "User not owned this comment",
            });
        }

        const deleting = await Comment.deleteOne({ _id: comment_id });

        res.status(200).json({
            success: true,
            data: deleting,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error,
        });
    }
};

exports.get_by_item = async(req, res) => {
    const { place_id } = req.params;
    const { skip, sort, limit } = req.query;

    try {
        // default
        let sortComment = {
            createdAt: 1,
        };
        if (sort) sortComment.createdAt = sort;

        let populate = {
            path: "comments",
            options: { skip: 0, limit: 5, sort: sortComment },
        };
        //default option paginate
        let options = {
            populate: populate,
        };
        let filter = {};
        if (place_id) filter._id = place_id;
        console.log(place_id);
        if (skip) populate.options.skip = skip;
        if (limit) populate.options.limit = limit;
        // const item_doc = await Place.findById(place_id).populate("comments");
        const item_doc = await Place.paginate(filter, options);
        // console.log(item_doc.docs);

        let rating = [{
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

        let totalComment = "";
        item_doc.docs.forEach((comment) => {
            totalComment = comment.totalComment;
            comment.comments.forEach((res) => {
                if (res.rating == 5) {
                    rating[0].count++;
                } else if (res.rating == 4) {
                    rating[1].count++;
                } else if (res.rating == 3) {
                    rating[2].count++;
                } else if (res.rating == 2) {
                    rating[3].count++;
                } else if (res.rating == 1) {
                    rating[4].count++;
                }
            });
        });
        // item_doc.comments.forEach((comment) => {
        //     if (comment.rating == 5) {
        //         rating[0].count++;
        //     } else if (comment.rating == 4) {
        //         rating[1].count++;
        //     } else if (comment.rating == 3) {
        //         rating[2].count++;
        //     } else if (comment.rating == 2) {
        //         rating[3].count++;
        //     } else if (comment.rating == 1) {
        //         rating[4].count++;
        //     }
        // });

        rating[0].value = parseFloat(rating[0].count / totalComment) * 100;
        rating[1].value = parseFloat(rating[1].count / totalComment) * 100;
        rating[2].value = parseFloat(rating[2].count / totalComment) * 100;
        rating[3].value = parseFloat(rating[3].count / totalComment) * 100;
        rating[4].value = parseFloat(rating[4].count / totalComment) * 100;

        // console.log("rating", rating);

        res.json({ success: true, data: item_doc, rating });
    } catch (error) {
        res.json({ success: false, error: error });
    }
};