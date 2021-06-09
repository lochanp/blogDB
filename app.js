if(process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const express = require("express");
const ejs = require("ejs");
const mongoose = require('mongoose');

const homeStartingContent = "Hi this is a Daily Blog Website Created by Lochan Potdar. Here anyone can post any content or information about the topic you like or any information you want to share with the world. You can also read the available blog posts and gain knowledge about a certain topic of your interest. Thank you!!";
const aboutContent = "Hello, Iam Lochan Potdar. This Website is created by me for sharing daily blogs about any interesting topic you would like to read. The app is created using HTML, CSS , EJS Templetes for the front-end, NodeJS for the back-end and MongoDB as the database storage for your blogs.";
const contactContent = "If you like this Simple and Easy to use Website or you have some suggestions for improvment you can contact me here.  ";

const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/blogDB";

mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useCreateIndex:true,
  useUnifiedTopology:true,
  useFindAndModify:false
}).then(() => {
  console.log('connected')
}).catch(err => {
  console.log('error');
  console.log(err);
})


const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);

app.get("/", function(req, res){

  Post.find({}, function(err, posts){
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
      });
  });
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });


  post.save(function(err){
    if (!err){
        res.redirect("/");
    }
  });
});

app.get("/posts/:postId", function(req, res){

const requestedPostId = req.params.postId;

  Post.findOne({_id: requestedPostId}, function(err, post){
    res.render("post", {
      title: post.title,
      content: post.content
    });
  });

});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

const port = process.env.PORT || 3000;

app.listen(port, function() {
  console.log(`Server started on port ${port}`);
});
