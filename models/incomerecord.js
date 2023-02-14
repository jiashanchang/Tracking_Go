const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const incomeRecordSchema = new mongoose.Schema({
    memberId: {
        type: Schema.Types.ObjectId,
        ref: "members",
        index: true,
        required: true,
    },
    categoryId: {
        type: Schema.Types.ObjectId,
        ref: "incomecategories",
    },
    receive: {
        type: String,
        required: true,
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
});

module.exports = mongoose.model("incomerecords", incomeRecordSchema);