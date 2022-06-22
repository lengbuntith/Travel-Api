const Event = require("../models/Event");
const decoded = require("../services/decodeToken");

const create = async(req, res) => {
    const { place_id, requirement, describe } = req.body;
    try {
        const token = req.headers.authorization;
        const user = decoded(token);
        // console.log(user);
        const createEvent = await Event.create({
            user: user.data.user_id,
            place: place_id,
            desc: describe,
            requirement: requirement,
        });
        res.status(200).json({ success: true, data: createEvent });
    } catch (error) {
        res.status(400).json({ success: false, error: error });
    }
};

const get_all = async(req, res) => {
    const { page, sort, each_user, num_per_page } = req.query;
    try {
        // const find = await Event.find().populate(["user", "place"]);
        // const find = await Event.find()
        let populate = [{
                path: "user",
                select: { firstName: 1, lastName: 1, imageUrl: 1 },
            },
            {
                path: "place",
                select: { title: 1, thumbnail: 1 },
            },
        ];

        let sortFilter = { createdAt: sort };
        // if (sort) sortFilter.createAt = 1;
        let options = {
            page: 1,
            limit: 6,
            populate: populate,
            sort: sortFilter,
        };

        //paginate
        if (page) options.page = page;
        //limit per page
        if (num_per_page) options.limit = num_per_page;

        let filter = {};
        if (each_user) {
            const token = req.headers.authorization;
            const user = decoded(token);
            filter.user = user.data.user_id;
        }
        const find = await Event.paginate(filter, options);
        res.status(200).json({ success: true, data: find });
    } catch (error) {
        res.status(400).json({ success: false, error: error });
    }
};

const get_id = async(req, res) => {
    const { id } = req.params;
    //   console.log(id);
    try {
        const findById = await Event.findById(id)
            .populate({ path: "place", select: { title: 1, images: 1 } })
            .populate({
                path: "user",
                select: { firstName: 1, lastName: 1, imageUrl: 1 },
            });
        res.status(200).json({ success: true, data: findById });
    } catch (error) {
        res.status(400).json({ success: false, error: error });
    }
};
const delete_event = async(req, res) => {
    const { id } = req.params;
    try {
        const token = req.headers.authorization;
        const user = decoded(token);
        // console.log(user);

        const findEvent = await Event.findById(id);
        console.log(findEvent);

        //if event not found
        if (!findEvent) throw "Event not found!";

        // check owner of event exist or not
        if (user.data.user_id != findEvent.user) throw "You are not owner!";
        else await Event.deleteOne({ _id: id });
        res.status(200).json({ success: true, data: "deleted successful" });
    } catch (error) {
        res.status(400).json({ success: false, error: error });
    }
};

const update_event = async(req, res) => {
    const { place_id, describe, requirement } = req.body;
    const { id } = req.params;
    console.log(id);
    try {
        const token = req.headers.authorization;
        const user = decoded(token);

        const findEvent = await Event.findById(id);
        //check ownwer
        if (user.data.user_id != findEvent.user) throw "You are not ownwer";

        if (place_id) findEvent.place = place_id;
        if (describe) findEvent.desc = describe;
        if (requirement) findEvent.requirement = requirement;
        await findEvent.save();
        // console.log(findEvent);
        res.status(200).json({ success: true, data: findEvent });
    } catch (error) {
        res.status(400).json({ success: false, error: error });
    }
};

// req.params : update, delete, get by id
// req.body : create, update

module.exports = {
    create,
    get_all,
    get_id,
    delete_event,
    update_event,
};