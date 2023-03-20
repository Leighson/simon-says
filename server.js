// modules
const express = require("express"); // bind the module to express constant
const bodyParser = require("body-parser");
const app = express(); // this is a constant that binds the express module
const port = 3000;

app.use(bodyParser.urlencoded( {extended: true} ));

// return a message
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
})

app.get("/about", (req, res) => {
    res.send("I'm Lee, who are you?");
})

// when this file is called, app will listen for any calls to port 3000
// after which it will return the functionality in this file
app.listen(port, () => {
    console.log(`Server started on port ${port}.`)
});
