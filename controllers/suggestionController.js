const decoded = require("../services/decodeToken");
const Suggestion = require("../models/Suggestion");
//const res = require("express/lib/response");
// const req = ("express/lib/request");

const create = async(req, res) => {
    const { place_id, message } = req.body;
    try {
        const token = req.headers.authorization;
        const user = decoded(token);
        console.log(user);

        //check register or have account or not

        const createSuggestion = await Suggestion.create({
            place: place_id,
            user: user.data.user_id,
            message: message,
            // comment : comment,
        });
        res.status(200).json({ success: true, data: createSuggestion });
    } catch (error) {
        res.status(400).json({ success: false, error: error });
    }
};

const get_all = async(req, res) => {
    const { city_id, page, sort } = req.query;
    try {
        //filter get all
        let populate = [
            { path: "place", select: { title: 1, thumbnail: 1 } },
            {
                path: "user",
                select: { firstName: 1, lastName: 1, imageUrl: 1, _id: 0 },
            },
            {
                path: "likesuggests",
                select: { like: 1 },
            },
        ];
        //title :-1 : A to Z, 1: Z to A
        let sortFilter = { createdAt: sort };
        //default option paginate

        // if (sort) sortFilter.createdAt = 1
        let options = {
            page: 1,
            limit: 9,
            populate: populate,
            sort: sortFilter,
        };

        //modify option paginate
        if (page) options.page = page;

        //filter
        let filter = {};
        if (city_id) filter.city = city_id;

        const find = await Suggestion.paginate(filter, options);
        //update total rating to Place
        // let total_like = 0;

        find.docs.forEach((comment) => {
            comment.likesuggests.forEach((like) => {
                console.log(like);
                if (like.like) comment.totalLike++;
            });
            comment.totalComment = comment.commentsuggests.length;
        });
        // find.totalComment = total_rating;
        // await find.save();
        res.status(200).json({ success: true, data: find });
    } catch (error) {
        res.status(400).json({ success: false, error: error });
    }
};

// {_id: id}
const get_id = async(req, res) => {
    const { id } = req.params;
    console.log(id);
    try {
        const doc = await Suggestion.findOne({ _id: id })
            // console.log(doc);
            .populate({
                path: "place",
                select: {
                    title: 1,
                    thumbnail: 1,
                },
            })
            .populate({
                path: "user",
                select: {
                    firstName: 1,
                    lastName: 1,
                    imageUrl: 1,
                    _id: 0,
                },
            })
            .populate({
                path: "likesuggests",
                select: { like: 1 },
            });

        doc.likesuggests.forEach((like) => {
            console.log(like);
            if (like.like) doc.totalLike++;
        });
        doc.totalComment = doc.commentsuggests.length;

        await doc.save();

        res.status(200).json({ success: true, data: doc });
    } catch (error) {
        res.status(400).json({ success: false, error: error });
    }
};

const update_suggestion = async(req, res) => {
    const { place_id, message } = req.body;
    const { id } = req.params;
    try {
        const token = req.headers.authorization;
        const user = decoded(token);
        let findSuggestion = await Suggestion.findById(id);
        console.log(findSuggestion);
        if (user.data.user_id != findSuggestion.user._id)
            throw "You are not ownwer";
        if (place_id) findSuggestion.place = place_id;
        if (message) findSuggestion.message = message;

        await findSuggestion.save();

        res.status(200).json({ success: true, data: findSuggestion });
    } catch (error) {
        res.status(400).json({ success: false, error: error });
    }
};

const delete_suggestion = async(req, res) => {
    const { id } = req.params;
    try {
        const token = req.headers.authorization;
        const user = decoded(token);
        let findSuggestion = await Suggestion.findById(id);

        if (!findSuggestion) throw "Suggestion not found!";
        if (user.data.user_id != findSuggestion.user) throw "You are not owner!";
        else await Suggestion.deleteOne({ _id: id });

        res.status(200).json({ success: true, data: "Deleted successful!" });
    } catch (error) {
        res.status(400).json({ success: false, error: error });
    }
};
module.exports = {
    create,
    get_all,
    get_id,
    update_suggestion,
    delete_suggestion,
};