const express = require("express");
const path = require("path");

const messages = [
    {
        text: "Hi there!",
        user: "Amando",
        added: new Date(),
    },
    {
        text: "Hello World!",
        user: "Charles",
        added: new Date(),
    },
];
const app = express();

app.use(express.urlencoded({ extended: true }));
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs")

app.get("/", (req, res) => {
    res.render("index", { messages: messages });
});

app.get("/new", (req, res) => {
    res.render("form");
})
app.post("/new", (req, res) => {
    const newMessage = {
        text: req.body.message,
        user: req.body.user,
        added: new Date(),
    };
    messages.push(newMessage);
    res.redirect("/");
})

app.get("/details/:id", (req, res) => {
    const messageIndex = parseInt(req.params.id);
    if (isNaN(messageIndex) || messageIndex < 0 || messageIndex >= messages.length) {
        return res.status(404).send("Message not found");
    }
    res.render("details", { message: messages[messageIndex] });
})

const port = 3000;
app.listen(port, () => console.log(`Server listening on ${port}`));
