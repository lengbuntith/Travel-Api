const Place = require("../models/Place");

//get all Places
const get_all = async (req, res) => {
  const { city_id, title, page, item_per_page, most_comment } = req.query;

  try {
    //default option paginate
    let options = {
      page: 1,
      limit: 10,
      select: ["_id", "title", "thumbnail", "totalComment", "totalRating"],
    };

    //if query is contain most comments

    if (most_comment) {
      options.sort = { field: "asc", totalComment: -1 };
    }

    //modify option paginate
    if (page) options.page = page;
    if (item_per_page) options.limit = item_per_page;

    //filter
    let filter = {};
    if (city_id) filter.city = city_id;
    if (title) {
      const regex = new RegExp(title, "i");
      filter.title = { $regex: regex };
    }

    const all = await Place.paginate(filter, options);
    res.status(200).json({ success: true, data: all });
  } catch (error) {
    res.status(500).json({ success: false, error: error });
  }
};
// get a Place detail by ID
const get_id = async (req, res) => {
  const { id } = req.params;

  try {
    const doc = await Place.findOne({ _id: id }).populate(["city", "comments"]);
    res.status(200).json({ success: true, data: doc });
  } catch (error) {
    res.status(500).json({ success: false, error: error });
  }
};

// create new Place
const create = async (req, res) => {
  try {
    const doc = await Place.create(req.body);
    await doc.save();

    res.status(201).json({ success: true, data: doc });
  } catch (error) {
    res.status(400).json({ success: false, error: error });
  }
};

//delete a Place by id
const delete_by_id = async (req, res) => {
  const { id } = req.params;
  try {
    const deleting = await Place.deleteOne({ _id: id });
    res.json({ success: true, data: deleting });
  } catch (error) {
    res.json({ success: false, error: error });
  }
};

//update a Place by id
const update_by_id = async (req, res) => {
  const { id } = req.params;
  const { title, date, story, lat, lng, images, city } = req.body;

  try {
    const doc = await Place.findById(id);

    //dynamic update field
    if (title) doc.title = title;
    if (date) doc.date = date;
    if (story) doc.story = story;
    if (lat) doc.lat = lat;
    if (lng) doc.lng = lng;
    if (images) doc.images = images;
    if (city) doc.city = city;

    await doc.save();

    res.json({ success: true, data: doc });
  } catch (error) {
    res.json({ success: false, error: error });
  }
};

module.exports = {
  get_all,
  get_id,
  create,
  update_by_id,
  delete_by_id,
};
