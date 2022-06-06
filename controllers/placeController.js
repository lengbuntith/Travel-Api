const Place = require ("../models/Place");

const get_all = async (req, res) => {
    try {
        const all = await Place.find();
        res.status(200).json({ success: true, data: all });
      } catch (error) {
        res.status(500).json({ success: false, error: error });
      }
}

const get_id = async (req, res) => {
    const { id } = req.params;
    console.log(id);
    try {
      const doc = await Place.findById(id);
      console.log(doc);
      res.status(200).json({ success: true, data: doc });
    } catch (error) {
      res.status(500).json({ success: false, error: error });
    }
 }

const create = async (req, res) => {
    try {
        const doc = await Place.create(req.body);
        await doc.save();
    
        res.json({ success: true, data: doc });
      } catch (error) {
        res.json({ success: false, error: error });
      }
}

//delete a product by id
const delete_by_id = async (req, res) => {
  const { id } = req.params;
  try {
    const deleting = await Product.deleteOne({ _id: id });
    res.json({ success: true, data: deleting });
  } catch (error) {
    res.json({ success: false, error: error });
  }
};

//update a prodcut by id
const update_by_id = async (req, res) => {
  const { id } = req.params;
  const { title,date,story } = req.body;

  try {
    const doc = await Product.findById(id);

    if (title) doc.title = title;
    if (date) doc.date = date;
    if (story) doc.story = story;

    await doc.save();

    res.json({ success: true, data: doc });
  } catch (error) {
    res.json({ success: false, error: error });
  }
};

module.exports ={
    get_all,
    get_id,
    create,
    update_by_id,
    delete_by_id
}