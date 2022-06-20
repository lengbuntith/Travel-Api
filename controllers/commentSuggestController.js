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
    const { id, each_user, page, num_per_page } = req.params;
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

        //paginate
        if (page) options.page = page;
        //limit per page
        if (num_per_page) options.limit = num_per_page;

        let filter = {};

        if (id) filter.suggestion = id;
        if (each_user) {
            const token = req.authorization.headers;
            const user = decoded(token);

            filter.user = user.data.user_id;
        }
        const get_like = await CommentSuggestion.paginate(filter, options);
        res.status(200).json({ success: true, data: get_like });
    } catch (error) {
        res.status(400).json({ success: false, error: error });
    }
};

const delete_suggest = async(req, res) => {
    const { comment_id } = req.params;

    try {
        const token = req.headers.authorization;
        const user = decode(token);

        //get comment info
        const comment_info = await CommentSuggestion.findById(comment_id);

        //check if comment is owned by this user id
        if (comment_info.user != user.data.user_id) {
            return res.status(400).json({
                success: false,
                error: "User not owned this comment",
            });
        }

        const deleting = await CommentSuggestion.deleteOne({ _id: comment_id });

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

module.exports = {
    create,
    get_by_suggest,
    delete_suggest,
};