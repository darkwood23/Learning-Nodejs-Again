import Category from '../models/categories.js';
import Item from '../models/items.js';

import { body, validationResult } from 'express-validator'

import asyncHandler from 'express-async-handler'

const index = asyncHandler(async (req, res, next) => {
    const [numCategories, numItems, categories, items] = await Promise.all([
        Category.countDocuments({}).exec(),
        Item.countDocuments({}).exec(),
        Category.find().sort({title: 1}).exec(),
        Item.find().populate("categories").exec(),
    ])

    res.render("index", {numCategories, numItems, categories, items})
})

const category_detail = asyncHandler(async (req, res, next) => {
    const [category, items] = await Promise.all([
        Category.findById(req.params.id).exec(),
        Item.find({ categories: req.params.id }).exec()
    ])

    res.render("category_detail", { category, items })
})

const category_create_get = asyncHandler(async (req, res, next) => {
    res.render("category_form", { title: 'Create Category', type: 'create' })
})

const category_create_post = [
    body("title", "Category must contain at least 3 characters")
        .trim()
        .isLength({ min: 3 })
        .escape(),
    body("description", "Description must contain at least 10 characters")
        .trim()
        .isLength({min: 10})
        .escape(),
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req)

        
        const category = new Category({
            title: req.body.title,
            description: req.body.description,
        })
        
        if (!errors.isEmpty()) {
            res.render("category_form", { title: 'Create Category', category, errors: errors.array() })
            return
        }
        
        const categoryExists = await Category.findOne({ title: req.body.title }).exec()

        if(categoryExists) {
            res.redirect(categoryExists.url)
            return
        }

        await category.save()
        res.redirect(category.url)
    })
]

const category_update_get = asyncHandler(async (req, res, next) => {
    const category = await Category.findById(req.params.id).exec()

    if (category === null) {
        const err = new Error('Category not found')
        err.status = 404
        return next(err)
    }

    res.render("category_form", {title: "Update Category", category, type: 'update'})
})

const category_update_post = [
    body("title", "Category must contain at least 3 characters")
        .trim()
        .isLength({ min: 3 })
        .escape(),
    body("description", "Description must contain at least 10 characters")
        .trim()
        .isLength({ min: 10 })
        .escape(),
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req)

        const category = {
            _id: req.params.id,
            title: req.body.title,
            description: req.body.description,
        }

        if(!errors.isEmpty()) {
            res.render("category_form", { title: "Update Category", category, errors })
        }

        const createdCateogry = await Category.findByIdAndUpdate(req.params.id, category, {new: true}).exec()
        res.redirect(createdCateogry.url)
    })
]

const category_delete_get = asyncHandler(async (req, res, next) => {
    const category = await Category.findById(req.params.id).exec()

    if (category === null) {
        const err = new Error('Category not found')
        err.status = 404
        return next(err)
    }

    res.render("category_delete", { category })
})

const category_delete_post = asyncHandler(async (req, res, next) => {
    const category = await Category.findById(req.params.id).exec()

    if (!category) {
        res.status(404).send('Category not found')
        return 
    }

    const items = await Item.find({ categories: req.params.id }).exec()

    if(items.length > 0) {
        res.render("category_delete", {
            title: "Delete Category", 
            category, 
            errors: [{msg: "Cannot delete category with associated items"}]
        })
        return
    }

    await Category.findByIdAndDelete(req.params.id).exec()
    res.redirect("/")
})

export { index, category_detail, category_create_get, category_create_post, category_update_get, category_update_post, category_delete_get, category_delete_post }