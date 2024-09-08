import path from 'path'
import * as fs from 'fs'

const checkImageExists = (req, res, next) => {
    const imagePath = path.join('public/uploads/' + req.item.image)

    fs.access(imagePath, fs.constants.F_OK, (err) => {
        if (err) {
            req.imageExists = false;
        } else {
            req.imageExists = true; 
        }
        next()
    })

}

export default checkImageExists