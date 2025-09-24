import express from 'express';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import  methodOverride from 'method-override'
// ⇨ '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(methodOverride('_method'));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "views"))); // ✅ Serve static files


let posts= [
    {
        id: uuidv4(),
        username: "aryan",
        content: "get request"

    },
     {
         id: uuidv4(),
        username: "assi",
        content: "post request"

    },
     {
         id: uuidv4(), 
        username: "vishal",
        content: "view request"

    },
]

// View engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Routes
app.get("/posts", (req, res) => {
  res.render('index.ejs',{posts});
});

app.get("/posts/new", (req, res) => {
  res.render('newpost.ejs');
});
app.post("/posts", (req, res) => {
  let { username, content } = req.body;
  let id = uuidv4();
  posts.push({id, username, content });
  res.redirect("/posts"); //Show updated list
});

app.get("/posts/:id", (req, res) => {
  let { id } = req.params;
  let post = posts.find((p) => p.id === id);
  if (!post) {
    return res.status(404).send("Post not found");
  }
  res.render("show.ejs", { post });
});

app.patch("/posts/:id",(req,res)=>{
   let { id } = req.params;
   let newContent = req.body.content;
  
    let post = posts.find((p) => id === p.id);
   if (!post) {
    return res.status(404).send("Post not found");
  }; 
  post.content = newContent;
  console.log(post);
  res.redirect("/posts");
})


app.get("/posts/:id/edit",(req,res)=>{
   let { id } = req.params;
     let post = posts.find((p) => id ===p.id);
     res.render("edit.ejs",{post})
})

app.delete("/posts/:id",(req,res)=>{
     let { id } = req.params;
       posts = posts.filter((p) => id !==p.id);
res.redirect("/posts")
})

const port = 8000;
app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});