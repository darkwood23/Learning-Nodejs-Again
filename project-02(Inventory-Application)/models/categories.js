import mongoose from "mongoose";
const Schema = mongoose.Schema

const Category = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
})

Category.virtual("url").get(function () {
    return `/catalog/category/${this._id}`
})

export default mongoose.model('Category', Category)