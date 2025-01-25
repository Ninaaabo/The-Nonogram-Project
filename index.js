import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("views"));


const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "To-Do List",
  password: "Three2one0$",
  port: 5432,
});
db.connect();

app.get("/", (req, res) =>{
    res.render("index.ejs", {x: 10, y: 10});
})

app.listen(port, (err) => {
    if (err) console.log(err);
    else console.log("Listening to port ", port);
})