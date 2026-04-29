require("dotenv").config();

const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const dbUrl = process.env.ATLASDB_URL;

async function main() {
  await mongoose.connect(dbUrl);
  console.log(" Connected to DB");
}

const initDB = async () => {
  await Listing.deleteMany({});

  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: new mongoose.Types.ObjectId("6979ae30d7981a39233fe6da"),
  }));

  await Listing.insertMany(initData.data);

  console.log("Data initialized");
};

main()
  .then(() => initDB())
  .then(() => mongoose.connection.close())
  .catch((err) => console.log(err));