const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const costRecordSchema = new mongoose.Schema({
    memberId: {
        type: Schema.Types.ObjectId,
        ref: "members",
        index: true,
        required: true,
    },
    categoryId: {
        type: Schema.Types.ObjectId,
        ref: "costcategories",
    },
    payId: {
        type: Schema.Types.ObjectId,
        ref: "assetliabilitycategories",
    },
    createdAt: {
        type: String,
        required: true,
    },
    year: {
        type: String,
        required: true,
    },
    month: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        trim: true,
        required: true,
    },
    remark: {
        type: String,
        trim: true,
    },
}, { versionKey: false });

module.exports = mongoose.model("costrecords", costRecordSchema);