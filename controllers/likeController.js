const Likes = require("../models/Likes");
const Suggestion = require("../models/Suggestion");
const decoded = require("../services/decodeToken");

const create = async(req, res) => {
    const { suggestionID } = req.body;
    try {
        const token = req.headers.authorization;
        const user = decoded(token);

        let liked = true;

        let findLikedUser = await Likes.find({ user: user.data.user_id });
        let likeUser = "";

        if (findLikedUser == "") {
            console.log(findLikedUser);
            likeUser = await Likes.create({
                suggestion: suggestionID,
                like: liked,
                user: user.data.user_id,
            });
            await likeUser.save();
            console.log(likeUser);

            //get information of place
            const suggest_doc = await Suggestion.findById(suggestionID);

            //append new comment to Place
            suggest_doc.likesuggests.push(likeUser._id);
            //   console.log("place doc", place_doc.comments[0]);
            //  console.log(suggest_doc);
            await suggest_doc.save();
        } else {
            console.log(findLikedUser[0].like, "hello");
            findLikedUser[0].like = !findLikedUser[0].like;
            console.log(findLikedUser[0].like);
            await findLikedUser[0].save();
        }
        // await findLikedUser.save();
        // res.status(200).json({ success: true, user: findLikedUser });
        res.status(200).json({ success: true, data: findLikedUser });
    } catch (error) {
        res.status(400).json({ success: false, error: error });
    }
};
const get_by_suggestion = async(req, res) => {
    const { id } = req.params;
    console.log(id, "id");
    try {
        const get_like = await Likes.find({ suggestion: id });
        res.status(200).json({ success: true, data: get_like });
    } catch (error) {
        res.status(400).json({ success: false, error: error });
    }
};

module.exports = {
    create,
    get_by_suggestion,
};