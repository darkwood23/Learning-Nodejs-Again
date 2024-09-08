import multer from 'multer'
import path from 'path'

const storage = multer.diskStorage({
    destination: (req, res, cb) => {
        cb(null, 'public/uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({
    storage: storage,
    limits: { fileSize: 10000000 },
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
        const mimetype = filetypes.test(file.mimetype)

        if(mimetype && extname) {
            return cb(null, true)
        } else {
            cb('Error: Images only!')
        }
    }

})

export default upload