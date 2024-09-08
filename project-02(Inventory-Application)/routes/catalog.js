import express from 'express'

const router = express.Router()

import * as category_controller from '../controllers/categoriesController.js'
import * as item_controller from '../controllers/itemsController.js'

import checkImageExists from '../middlewares/imageChecker.js'
import upload from '../middlewares/uploadImage.js'

// Categories Controller 

router.get("/", (req, res) => {
    res.redirect("/catalog/category")
})

router.get('/category', category_controller.index)

router.get('/category/create', category_controller.category_create_get)
router.post('/category/create', category_controller.category_create_post)

router.get('/category/:id', category_controller.category_detail, )

router.get('/category/:id/update', category_controller.category_update_get)
router.post('/category/:id/update', category_controller.category_update_post)

router.get('/category/:id/delete', category_controller.category_delete_get)
router.post('/category/:id/delete', category_controller.category_delete_post)

// Items Controller

router.get('/item', item_controller.index)

router.get('/item/create', item_controller.item_create_get)
router.post('/item/create', item_controller.item_create_post)

router.get('/item/:id', item_controller.item_detail, checkImageExists, (req, res) => {
    const imgPath = '/uploads/' + req.item.image
    res.render('item_detail', { title: req.item.name, item: req.item, imageExists: req.imageExists, imgPath })
})

router.get('/item/:id/image', item_controller.item_detail, checkImageExists, (req, res) => {
    const imgPath = '/uploads/' + req.item.image;

    // Render the EJS template with the appropriate variables
    res.render('item_image', {
        title: `Add image to: ${req.item.name}`,
        imageExists: req.imageExists,
        item: req.item,
        imgPath // Pass the imgPath to the EJS template
    });
})

router.post('/item/:id/image', upload.single('image'), item_controller.item_image_post)

router.get('/item/:id/update', item_controller.item_update_get)
router.post('/item/:id/update', item_controller.item_update_post)

router.get('/item/:id/delete', item_controller.item_delete_get)
router.post('/item/:id/delete', item_controller.item_delete_post)

export { router }