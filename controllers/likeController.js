const Likes = require("../models/Likes");
const Suggestion = require("../models/Suggestion");
const decoded = require("../services/decodeToken");

const create = async(req, res) => {
    const { suggestionID } = req.body;
    try {
        const token = req.headers.authorization;
        const user = decoded(token);

        let liked = true;

        let findLikedUser = await Likes.find({
            user: user.data.user_id,
            suggestion: suggestionID,
        });
        let likeUser = "";

        if (findLikedUser == "") {
            likeUser = await Likes.create({
                suggestion: suggestionID,
                like: liked,
                user: user.data.user_id,
            });
            await likeUser.save();
            // console.log(likeUser);

            //get information of place
            const suggest_doc = await Suggestion.findById(suggestionID);

            //append new comment to Place
            suggest_doc.likesuggests.push(likeUser._id);
            //   console.log("place doc", place_doc.comments[0]);
            await suggest_doc.save();
        } else {
            findLikedUser[0].like = !findLikedUser[0].like;
            await findLikedUser[0].save();
        }

        const doc = await Suggestion.findById(suggestionID).populate({
            path: "likesuggests",
        });
        console.log(doc);

        doc.totalLike = 0;

        doc.likesuggests.forEach((like) => {
            console.log(like);
            if (like.like) doc.totalLike++;
        });
        await doc.save();
        // res.status(200).json({ success: true, user: findLikedUser });
        res.status(200).json({ success: true, data: findLikedUser });
    } catch (error) {
        res.status(400).json({ success: false, error: error });
    }
};
const get_by_user = async(req, res) => {
    const { page, num_per_page } = req.query;
    // console.log(id, "id");
    try {
        let options = {
            page: 1,
            limit: 10,
        };

        if (page) options.page = page;
        if (num_per_page) options.limit = num_per_page;

        let filter = {};
        const token = req.headers.authorization;
        const user = decoded(token);
        filter.user = user.data.user_id;

        //select true
        filter.like = true;

        const get_like = await Likes.paginate(filter, options);
        res.status(200).json({ success: true, data: get_like });
    } catch (error) {
        res.status(400).json({ success: false, error: error });
    }
};

module.exports = {
    create,
    get_by_user,
};