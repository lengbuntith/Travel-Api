const CommentSuggestion = require("../models/CommentSuggestion");
const Suggestion = require("../models/Suggestion");
const decoded = require("../services/decodeToken");

const create = async(req, res) => {
    const { suggestionID, comment } = req.body;
    try {
        const token = req.headers.authorization;
        const user = decoded(token);
        const commentSuggest = await CommentSuggestion.create({
            suggestion: suggestionID,
            comment: comment,
            user: user.data.user_id,
        });
        await commentSuggest.save();

        //get information of place
        const suggest_doc = await Suggestion.findById(suggestionID);

        //append new comment to Place
        suggest_doc.commentsuggests.push(commentSuggest._id);
        //   console.log("place doc", place_doc.comments[0]);
        console.log(suggest_doc);
        await suggest_doc.save();

        res.status(200).json({ success: true, data: commentSuggest });
    } catch (error) {
        res.status(400).json({ success: false, error: error });
    }
};
const get_by_suggest = async(req, res) => {
    const { id } = req.params;
    // console.log(id, "id");
    try {
        let options = {
            page: 1,
            limit: 5,
            populate: {
                path: "user",
                select: { firstName: 1, lastName: 1, imageUrl: 1 },
            },
        };
        let filter = {};

        if (id) filter.suggestion = id;
        const get_like = await CommentSuggestion.paginate(filter, options);
        res.status(200).json({ success: true, data: get_like });
    } catch (error) {
        res.status(400).json({ success: false, error: error });
    }
};

module.exports = {
    create,
    get_by_suggest,
};