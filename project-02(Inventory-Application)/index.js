import express, { text } from 'express'
import dotenv from 'dotenv'
import { connectToMongoDB } from './db/connectToMongoDB.js'
import path from 'path'
import { fileURLToPath } from 'url';
import * as catalogRouter from './routes/catalog.js'

dotenv.config()
const app = express()

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("views", path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(express.static(path.join(__dirname, 'public')));

app.use('/catalog', catalogRouter.router)

app.get("/", (req, res, next) => {
    res.redirect("/catalog")
})

const port = process.env.PORT
app.listen(port, () => {
    connectToMongoDB()
    console.log(`Server listening on ${port}`)
})