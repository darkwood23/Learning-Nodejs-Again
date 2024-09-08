import Item from "../models/items.js";
import Category from "../models/categories.js";
import mongoose from "mongoose";

import { body, validationResult } from 'express-validator'

import asyncHandler from 'express-async-handler'
import deleteImage from "../middlewares/imageDelete.js";

const index = asyncHandler(async (req, res, next) => {
    const items = await Item.find().populate("categories").sort({name: 1}).exec()

    res.render('all_items', { title: 'All items', items })
})

const item_detail = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        console.log({id})
        const err = new Error('Invalid ID format');
        err.status = 400; // Bad Request
        return next(err);
    }

    const item = await Item.findById(id).populate("categories").exec();

    if (!item) {
        const err = new Error('Item not found');
        err.status = 404;
        return next(err);
    }

    req.item = item;
    next();
});

const item_create_get = asyncHandler(async (req, res, next) => {
    const categories = await Category.find().exec()

    res.render('item_form', { title: "Create Item", categories })
})

const item_create_post = [
    body('name', 'Name must contain at least 3 characters')
        .trim()
        .isLength({ min: 3 })
        .escape(),
    body('price', 'Price must be defined')
        .trim()
        .escape(),
    body('stock', 'Stock must be at least 1')
        .trim()
        .isInt({ gt: 0 })
        .escape(),
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req)

        if (req.body['category[]'].length < 1) {
            errors.push({
                type: 'field',
                value: req.body['category'],
                msg: 'Item must have at least one category',
                path: 'category',
                location: 'body',
            })
        }

        const item = new Item({
            name: req.body.name,
            price: req.body.price,
            stock: req.body.stock,
            image: 'no-image',
            categories: req.body['category[]'],
        })

        if (!errors.isEmpty()) {
            console.log(errors)
            return res.render("item_form", { title: "Create Item", item: item, errors: errors.array() })
        }

        const itemExists = await Item.findOne({ name: item.name }).exec()

        if(itemExists) {
            res.redirect(itemExists.url)
            return
        } 

        await item.save()
        res.redirect(item.url)
    })
]

const item_update_get = asyncHandler(async (req, res, next) => {
    const item = await Item.findById(req.params.id).populate("categories").exec()
    const categories = await Category.find().exec()

    if(item === null) {
        const err = new Error('Item not found')
        err.status = 404
        return next(err)
    }

    res.render("item_form", { title: "Update Item", item, categories})
})

const item_update_post = [
    body('name', 'Name must contain at least 3 characters')
        .trim()
        .isLength({ min: 3 })
        .escape(),
    body('price', 'Price must be defined')
        .trim()
        .escape(),
    body('stock', 'Stock must be at least 1')
        .trim()
        .isInt({ gt: 0 })
        .escape(),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req)

        if (req.body['category[]'].length < 1) {
            errors.push({
                type: 'field',
                value: req.body['category'],
                msg: 'Item must have at least one category',
                path: 'category',
                location: 'body',
            })
        }

        const item = {
            name: req.body.name,
            price: req.body.price,
            stock: req.body.stock,
            image: 'no-image',
            categories: req.body['category[]'],
            _id: req.params.id,
        }

        if(!errors.isEmpty()) {
            res.render("item_form", { title: "Update Item", item, errors: errors.array()})
            return
        }

        const createdItem = await Item.findByIdAndUpdate(req.params.id, item, {new: true}).exec()
        res.redirect(createdItem.url)
    })
]

const item_delete_get = asyncHandler(async(req, res, next) => {
    const item = await Item.findById(req.params.id).populate("categories").exec()

    if (item === null) {
        const err = new Error('Item not found')
        err.status = 404
        return next(err)
    }

    res.render("item_delete", { title: 'Delete Item', item })
})

const item_delete_post = asyncHandler(async(req, res, next) => {
    const item = await Item.findById(req.params.id).exec()

    await deleteImage(item)
    
    await Item.findByIdAndDelete(req.params.id).exec()
    res.redirect('/catalog')
    
})

const item_image_get = asyncHandler(async(req, res, next) => {
    const item = await Item.findById(req.params.id).exec()

    if(item === null) {
        const err = new Error('Item not found')
        err.status = 404
        return next(err)
    }

    req.item = item;
    next()
})

const item_image_post = asyncHandler(async (req, res, next) => {
    if (!req.file) {
        return res.status(400).send('No file selected')
    }

    const item = await Item.findByIdAndUpdate(req.params.id, { image: req.file.filename }, {new: true}).exec()
    res.redirect(item.url)
})

export { index, item_detail, item_create_get, item_create_post, item_update_get, item_update_post, item_delete_get, item_delete_post, item_image_get, item_image_post }