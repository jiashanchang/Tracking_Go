const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const incomeCategorySchema = new mongoose.Schema({
    category: {
        type: String,
        trim: true,
        unique: true,
        required: true,
    },
    recordId: [
        {
            type: Schema.Types.ObjectId,
            ref: "incomerecords",
        },
    ],
}, { versionKey: false });

module.exports = mongoose.model("incomecategories", incomeCategorySchema);