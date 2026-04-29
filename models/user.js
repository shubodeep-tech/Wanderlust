const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose").default;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  wishlist: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Listing",
  },
],
});
console.log(typeof passportLocalMongoose);
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);