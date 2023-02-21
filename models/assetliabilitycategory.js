const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const assetLiabilityCategorySchema = new mongoose.Schema({
    category: {
        type: String,
        trim: true,
        unique: true,
        required: true,
    },
    costRecordId: [
        {
            type: Schema.Types.ObjectId,
            ref: "costrecords",
        },
    ],
    incomeRecordId: [
        {
            type: Schema.Types.ObjectId,
            ref: "incomerecords",
        },
    ],
    writeOffRecordId: [
        {
            type: Schema.Types.ObjectId,
            ref: "writeoffrecords",
        },
    ],
    taxRecordId: [
        {
            type: Schema.Types.ObjectId,
            ref: "taxrecords",
        },
    ],
}, { versionKey: false });

module.exports = mongoose.model("assetliabilitycategories", assetLiabilityCategorySchema);