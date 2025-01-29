import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import dotenv from 'dotenv';


const app = express();
const port = 3000;
var x = 0;
var y = 0;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("views"));

dotenv.config();
const {Pool} = pg;
const db = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

db.on("error", (e) => {
  console.error("Database error", e);
  db = null;
});
db.connect();



// const db = new pg.Client({
//   user: process.env.user,
//   host: process.env.host,
//   database: process.env.database,
//   password: process.env.password,
//   port: 5432,
// });
// db.connect();

async function convertNumber(id){
  
  var info = await db.query("select * from art_info where id = $1", [id]);
  // console.log("im loggin here");
  // console.log(info.rows);
  var art = await db.query("select * from art_collection where id = $1", [id]);
  art = art.rows;
  // console.log(art);

  if(info.rows.length === 0 ) return false;
  const x = info.rows[0].x;
  const y = info.rows[0].y;

  // x= 0, y run 
  let makeNumber = (num1, num2, xFirst) =>{
    const result = [];
    var count = 0;
    for (var i = 0; i < num1; i++){
      const currentCol = [];
      var middleWhite = false;
  
      for(var j = 0; j < num2; j++){
        const coordinate = (xFirst)? count++ : j*y+i;
        // console.log("your coordinate: ", coordinate, "j = ", j, "i = ", i, "y = ", y);
        // console.log("pixel is ", JSON.stringify(art[coordinate]))
        if (currentCol.length === 0){
          if(art[coordinate].isblack) currentCol.push(1);
        }
        else{
          if(art[coordinate].isblack) {
            if(middleWhite) {
              currentCol.push(1);
              middleWhite = false;
            }
            else currentCol[currentCol.length-1] ++;
          }
          else middleWhite = true;
        }
        // console.log("current col", currentCol, "xfirst: ", xFirst)
      }
      result.push(currentCol);
    }
    // console.log("your result", result)
    return result;
  }
  var xNumbers = makeNumber(x, y, true);
  // console.log("starting y")
  var yNumbers = makeNumber(y, x, false);

  // console.log("your xnumbers: ", xNumbers)
  // console.log("your ynumbers: ", yNumbers)

  return [xNumbers, yNumbers];
}

app.get("/", (req, res) =>{
  res.render("landing.ejs", {url: `${req.protocol}://${req.get('host')}`});
})

app.post("/make-art", (req, res) =>{
  x = req.body.x;
  y = req.body.y;
  res.render("make-art.ejs", {x, y, url: `${req.protocol}://${req.get('host')}`});
})

app.get("/sizing", (req, res) =>{
  res.render("sizing.ejs", {url: `${req.protocol}://${req.get('host')}`});
})

app.post("/art-submit", async(req, res) =>{
  // console.log("receiving", req.body);
  var id = await db.query(`
    INSERT INTO art_info(name, x, y)
    VALUES($1, $2, $3)
    RETURNING id;
    `, [req.body.art_name, x, y]);
  
  id = id.rows[0].id;


  for(var i = 0; i < x; i++){
    for(var j = 0; j < y; j++){
      await db.query(`
        insert into art_collection
        values($1, $2, $3, $4)
        `, [id, i, j, req.body[i + "-" + j] === "black"])
    }
  }
  res.redirect("/get-nonogram?id="+id);
})

app.get("/all-art", async(req, res) =>{
  var info = await db.query("SELECT * FROM art_info");
  info = info.rows;
  res.render("gallery.ejs", {artList: info, url: `${req.protocol}://${req.get('host')}`})
})

app.get("/get-art", async(req, res)=>{
  var id = parseInt(req.query.id);


  var pic= await db.query("SELECT * FROM art_collection WHERE id = $1", [id]);

  var info = await db.query("SELECT * FROM art_info WHERE id = $1", [id]);

  pic= pic.rows;
  if(info.rows.length === 0) res.send("no such id");
  else{
    info = info.rows[0];
  // console.log("your pic is ", JSON.stringify(pic));

  var squares = [];

  for(var i = 0; i < info.y; i++){
    squares.push(new Array(info.x).fill(1));
  }

  for(var i = 0; i < info.x; i++){
    for(var j = 0; j < info.y; j++){
      // console.log("square[", j, "][", i,'] = ', pic[i*info.y+j].isblack)
      squares[j][i] = pic[i*info.y+j].isblack;
    }
  }
  // console.log("your square is ", JSON.stringify(squares))
  // console.log();
  res.render("showgrid.ejs", {name: info.name, squares, id:info.id, x: info.x, y: info.y, url: `${req.protocol}://${req.get('host')}`})
  }
  
})

app.get("/get-nonogram", async(req, res)=>{
  var id = parseInt(req.query.id);
  const numArr = await convertNumber(id);
  if(!numArr) res.send("No such id");
  else
    res.render("index.ejs", {x: numArr[0].length, y: numArr[1].length, numArr, id, url: `${req.protocol}://${req.get('host')}`})
})

app.post("/result", (req, res)=>{
  res.redirect("/get-art?id="+req.body.result);
})

app.post("/submit", (req, res) =>{
  // console.log(JSON.stringify(req.body));
  var squares = [[1, 1], [1, 1]];
  for(var i = 0; i < 2; i++){
    for(var j = 0; j < 2; j++){
      squares[j][i] = req.body[i + "-" + j];
      // console.log(squares);


    }
  }
  // console.log(squares);
  
  res.render("showgrid.ejs", {squares, x:2, y:2})
})
app.listen(port, (err) => {
    if (err) console.log(err);
    else console.log("Listening to port ", port);
})