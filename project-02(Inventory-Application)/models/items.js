import mongoose from "mongoose";
const Schema = mongoose.Schema;

const Item = new Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    image: { type: String, required: true },
    categories: [{type: Schema.Types.ObjectId, ref: 'Category'}]
})

Item.virtual("url").get(function () {
    return `/catalog/item/${this._id}`
})

export default mongoose.model('Item', Item)