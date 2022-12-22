require("dotenv").config();
const express = require("express");
const { initializeApp, cert } = require("firebase-admin/app");
const ejs = require("ejs");
const { credential } = require("firebase-admin");
const { getFirestore } = require("firebase-admin/firestore");

const homeStartingContent =
  "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent =
  "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent =
  "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";
let posts = [];
const app = express();
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");

app.use(express.static("public"));
// firebase

initializeApp({
  credential: cert({
    type: "service_account",
    project_id: process.env.PROJECT_ID,
    private_key_id: process.env.PRIVATE_KEY_ID,
    private_key: process.env.PRIVATE_KEY,
    client_email: process.env.CLIENT_EMAIL,
    client_id: process.env.CLIENT_ID,
    auth_uri: process.env.AUTH_URI,
    token_uri: process.env.TOKEN_URI,
    auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_CERT_URI,
    client_x509_cert_url: process.env.CLIENT_CERT_URI,
  }),
});
const db = getFirestore();
//home route

app.get("/", async (req, res) => {
  const snapshot = await db.collection("posts").get();
  snapshot.forEach((doc) => {
    const post = {
      id: doc.id,
      title: doc.data().title,
      content: doc.data().content,
    };
    posts.push(post);
  });
  res.render("home", { para: homeStartingContent, posts: posts });
  posts = [];
});

//contact route
app.get("/contact", (req, res) => {
  res.render("contact", { para: contactContent });
});

//about route
app.get("/about", (req, res) => {
  res.render("about", { para: aboutContent });
});

//compose route

app.get("/compose", async (req, res) => {
  res.render("compose");
});
app.post("/compose", async (req, res) => {
  const post = {
    title: req.body.postTitle,
    content: req.body.postContent,
  };

  await db.collection("posts").add(post);

  res.redirect("/");
});

// post route parameter

app.get("/post/:postid", async (req, res) => {
  const req_post_id = req.params.postid;
  const post = await db.collection("posts").doc(req_post_id).get();

  res.render("post", {
    title: post.data().title,
    content: post.data().content,
  });
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Server started on port 3000");
});
