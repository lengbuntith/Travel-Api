// const Saved = require("../models/Saved");
// const Place = require("../models/Place");
// const decode = require("../services/decodeToken");

// const all = async (req, res) => {
//   try {
//     //get user id by token
//     const token = req.headers.authorization;
//     const user = decode(token);
//     const user_id = user.data.user_id;

//     //get only saved item that have user id
//     const savedItems = await Saved.find({ user_id: user_id })
//       .select({ _id: 1, place: 1 })
//       .populate({
//         path: "place",
//         select: { _id: 1, title: 1, thumbnail: 1 },
//       });

//     res.status(200).json({ success: true, data: savedItems });
//   } catch (error) {
//     res.status(400).json({ success: false, error: error });
//   }
// };

// const add = async (req, res) => {
//   //get data from client
//   const { place_id } = req.body;

//   try {
//     if (!place_id) {
//       throw new Error("Required place_id");
//     }

//     //check if place is exist table Place
//     await Place.findById(place_id);

//     //get user id by token
//     const token = req.headers.authorization;
//     const user = decode(token);
//     const user_id = user.data.user_id;

//     //get all user saved items
//     const savedItems = await Saved.find({ user_id: user_id }).populate("place");

//     //check if user already own this Place id
//     let isExist = false;

//     savedItems.forEach((item) => {
//       if (item.place._id == place_id) {
//         isExist = true;
//       }
//     });

//     if (isExist) {
//       return res.status(400).json({ success: false, error: "Item is added" });
//     }

//     const doc = await Saved.create({
//       user: user_id,
//       user_id: user_id,
//       place: place_id,
//     });

//     await doc.save();

//     res.status(201).json({ success: true, data: doc });
//   } catch (error) {
//     res.status(400).json({ success: false, error: error });
//   }
// };

// const delete_by_id = async (req, res) => {
//   const { id } = req.params;

//   try {
//     //get user id by token
//     const token = req.headers.authorization;
//     const user = decode(token);
//     const user_id = user.data.user_id;

//     //get saved item from this id
//     let savedItem = await Saved.findOne({ _id: id }).populate([
//       "user",
//       "place",
//     ]);

//     //check if item not found
//     if (!savedItem) {
//       return res.status(400).json({ success: false, error: "Item not found" });
//     }

//     //verify that user absolute own this saved
//     if (savedItem.user._id != user_id) {
//       return res
//         .status(400)
//         .json({ success: false, error: "User not own this saved item" });
//     }

//     //delete saved item
//     const deleting = await Saved.deleteOne({ _id: id });
//     res.status(200).json({ success: true, data: deleting });
//   } catch (error) {
//     res.status(400).json({ success: false, error: error });
//   }
// };

// module.exports = {
//   all,
//   add,
//   delete_by_id,
// };

const Place = require("../models/Place");
const Saved = require("../models/Saved");
const decoded = require("../services/decodeToken");

const create = async(req, res) => {
    const { placeID } = req.body;
    try {
        const token = req.headers.authorization;
        const user = decoded(token);

        let saved = true;

        let findSaveUser = await Saved.find({
            place: placeID,
            user: user.data.user_id,
        });
        let saveUser = "";

        if (findSaveUser == "") {
            console.log(findSaveUser);
            saveUser = await Saved.create({
                place: placeID,
                saved: saved,
                user: user.data.user_id,
            });
            await saveUser.save();
            console.log(saveUser);

            //get information of place
            const place_doc = await Place.findById(placeID);

            //append new comment to Place
            place_doc.saved.push(saveUser._id);
            //   console.log("place doc", place_doc.comments[0]);
            //  console.log(suggest_doc);
            await place_doc.save();
        } else {
            findSaveUser[0].saved = !findSaveUser[0].saved;
            console.log(findSaveUser[0].saved);
            await findSaveUser[0].save();
        }
        // await findLikedUser.save();
        // res.status(200).json({ success: true, user: findLikedUser });
        res.status(200).json({ success: true, data: findSaveUser });
    } catch (error) {
        res.status(400).json({ success: false, error: error });
    }
};
const get_by_user = async(req, res) => {
    try {
        const token = req.headers.authorization;
        let user = "";
        if (!token) {
            user = {
                data: {
                    user_id: "62a9e1cc9585df0b1dbbec21",
                },
            };
        } else user = decoded(token);
        const get_saved = await Saved.find({
            user: user.data.user_id,
            saved: true,
        }).populate({
            path: "place",
            select: { title: 1, thumbnail: 1, story: 1, averageRating: 1 },
        });
        res.status(200).json({ success: true, data: get_saved });
    } catch (error) {
        res.status(400).json({ success: false, error: error });
    }
};
const get_by_place = async(req, res) => {
    const { id } = req.params;
    try {
        const token = req.headers.authorization;
        let user = "";
        if (!token) {
            user = {
                data: {
                    user_id: "62a9e1cc9585df0b1dbbec21",
                },
            };
        } else user = decoded(token);
        const get_saved = await Saved.find({
            user: user.data.user_id,
            saved: true,
            place: id,
        }).populate({
            path: "place",
            select: { title: 1, thumbnail: 1, story: 1, averageRating: 1 },
        });
        res.status(200).json({ success: true, data: get_saved });
    } catch (error) {
        res.status(400).json({ success: false, error: error });
    }
};

module.exports = {
    create,
    get_by_place,
    get_by_user,
};