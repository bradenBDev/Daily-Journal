require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const _ = require("lodash");


const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

// Configure Express.js
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//Configure Mongoose
mongoose.connect(`mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@cluster0.zpmjm.mongodb.net/journalPostsDB?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true});

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: String
});

const Post = mongoose.model("Post", postSchema);


// Home route, returning header.ejs, which renders a list of posts that are
// found in the database.

app.get("/", function(req, res){

    Post.find({}, function (err, posts) {

        // Render the home page and pass in the posts array returned from
        // the database. The post's title and content are rendered in a heading
        // and paragraph. The post's _id from the database is put into the
        // post's Read More link so that it can be retrieved later.
        res.render("home", {
            startingContent: homeStartingContent,
            posts: posts
        });

    });

});


// About route, returning the About page. It renders the above const "aboutContent".

app.get("/about", function(req, res){
    res.render("about", {aboutContent: aboutContent});
});


// Contact route. It returns the contact page and renders the above const "contactContent".

app.get("/contact", function(req, res){
    res.render("contact", {contactContent: contactContent});
});


// Get a specific post. PostId is the _id of the post in the database.

app.get("/posts/:postId", function(req, res){
    const requestedPost = req.params.postId;

    Post.findById(requestedPost, function (err, post) {
        if (post) {
            res.render("post", {title: post.title, content: post.content});

        } else {
            res.render("error");
        }
    });

});


// Compose route. It shows the compose page (this has to be navigated in the URL to for now, until I add
// username & password authentication, to keep it a bit more secret.)

app.route("/compose")

  // GET: Render the compose page.
    .get(function(req, res){
        res.render("compose");
    })


  // POST: Create a new post.
    .post(function(req, res){

        // Create a new Post() object with the request's title and body.
        const post = new Post({
            title: req.body.postTitle,
            content: req.body.postBody
        });

        post.save(function (err) {
            if (!err) {
                res.redirect("/");
            } else {
                res.render("error");
            }
        });

    });


app.listen(process.env.PORT || 3000, function() {
    console.log("Server started on port 3000");
});
