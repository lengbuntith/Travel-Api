const Item = require("../models/Item");

const create = async (req, res) => {
  try {
    const doc = await Item.create(req.body);
    await doc.save();
    res.status(201).json({ success: true, data: doc });
  } catch (error) {
    res.status(500).json({ success: false, error: error });
  }
};

const get = async (req, res) => {
  try {
    const all = await Item.find().select({
      _id: 1,
      title: 1,
      thumbnail: 1,
    });
    res.status(200).json({ success: true, data: all });
  } catch (error) {
    res.status(500).json({ success: false, error: error });
  }
};

const filter = async (req, res) => {
  const { city_id, title, page, item_per_page, select } = req.query;
  try {
    let options = {
      page: 1,
      limit: 10,
      populate: [],
      select: ["title", "thumbnail"],
    };

    if (select) {
      //select field
      let split = select.split("-");
      options.select = split;

      //populate field
      const populateFields = {
        city: true,
        rating: true,
      };

      split.forEach((element) => {
        if (populateFields[element]) {
          options.populate.push(element);
        }
      });
    }

    if (page) options.page = page;
    if (item_per_page) options.limit = item_per_page;

    let filter = {};
    if (city_id) filter.city = city_id;
    if (title) {
      const regex = new RegExp(title, "i");
      filter.title = { $regex: regex };
    }
    console.log(filter);

    const doc = await Item.paginate(filter, options);
    res.status(200).json({ success: true, data: doc });
  } catch (error) {
    res.status(500).json({ success: false, error: error });
  }
};

const by_id = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    const itemDetail = await Item.findById(id).populate(["city", "comments"]);

    res.status(200).json({
      success: true,
      data: {
        itemDetail,
        review: [
          {
            _id: 1,
            title: "Exellent",
            value: 70, //count / total reviewers
            count: 108, // number of reviewers
          },
          {
            _id: 2,
            title: "Very Good",
            value: 30,
            count: 48,
          },
          {
            _id: 3,
            title: "Average",
            value: 15,
            count: 29,
          },
          {
            _id: 4,
            title: "Poor",
            value: 5,
            count: 18,
          },
          {
            _id: 5,
            title: "Terible",
            value: 1,
            count: 6,
          },
        ],
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error });
  }
};

const update = (req, res) => {};

const delete_by_id = (req, res) => {};

module.exports = {
  create,
  get,
  filter,
  by_id,
  update,
  delete_by_id,
};
