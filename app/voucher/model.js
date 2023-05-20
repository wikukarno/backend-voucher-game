const mongoose = require("mongoose");
let voucherSchema = mongoose.Schema({
  name: {
    type: String,
    require: [true, "Nama game harus diisi"],
  },
  status: {
    type: String,
    enum: ["Y", "N"],
    default: "Y",
  },

  thumbnail: {
    type: String,
  },

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },

  nominal: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Nominal",
    },
  ],

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

});

module.exports = mongoose.model("Voucher", voucherSchema);
