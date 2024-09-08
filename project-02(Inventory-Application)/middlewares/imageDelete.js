import path from 'path'
import * as fs from 'fs'

const deleteImage = async (item) => {
    const imagePath = path.join('public/uploads/' + item.image)

    fs.unlink(imagePath, function (err) {
        if (err) {
            console.error(err)
            return { deleted: false, error: err}
        }
        return { deleted:true }
    })
}

export default deleteImage