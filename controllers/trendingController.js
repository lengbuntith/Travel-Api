const { find } = require("../models/Trending");
const Trending = require("../models/Trending");

const create = async(req, res) => {
    const { cityId, describe, top } = req.body;
    console.log(top);
    try {
        const createTrend = await Trending.create({
            city: cityId,
            describe: describe,
            top: top,
        });

        res.status(200).json({ success: true, data: createTrend });
    } catch (error) {
        res.status(400).json({ success: false, error: error });
    }
};

const get_all = async(req, res) => {
    try {
        let options = {
            page: 1,
            limit: 3,
            sort: { top: 1 },
            populate: { path: "city", select: { name: 1, image: 1 } },
        };
        filter = {};

        const findAll = await Trending.paginate(filter, options);
        res.status(200).json({ success: true, data: findAll });
    } catch (error) {
        res.status(400).json({ success: false, error: error });
    }
};

const update_by_id = async(req, res) => {
    const { id } = req.params;
    const { cityId, describe, top } = req.body;
    try {
        const findTrend = await Trending.findById(id);
        if (cityId) findTrend.city = cityId;
        if (describe) findTrend.describe = describe;
        if (top) findTrend.top = top;
        await findTrend.save();

        res.status(200).json({ success: true, data: findTrend });
    } catch (error) {
        res.status(400).json({ success: false, error: error });
    }
};

const delete_by_id = async(req, res) => {
    const { id } = req.params;
    try {
        const deleteTrend = await Trending.deleteOne({ _id: id });
        res.status(200).json({ success: true, data: deleteTrend });
    } catch (error) {
        res.status(400).json({ success: false, error: error });
    }
};
module.exports = {
    get_all,
    create,
    delete_by_id,
    update_by_id,
};