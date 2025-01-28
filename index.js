import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import dotenv from 'dotenv';

dotenv.config();


const app = express();
const port = 3000;
var x = 0;
var y = 0;
console.log("at line 13: ", process.env.user);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("views"));


const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "pixel-art",
  password: "Three2one0$",
  port: 5432,
});
db.connect();

async function convertNumber(id){
  
  var info = await db.query("select * from art_info where id = $1", [id]);
  var art = await db.query("select * from art_collection where id = $1", [id]);
  art = art.rows;
  if(info.rows.length === 0 ) return false;
  const x = info.rows[0].x;
  const y = info.rows[0].y;

  // x= 0, y run 
  let makeNumber = (num1, num2, xFirst) =>{
    const result = [];
    for (var i = 0; i < num1; i++){
      const currentCol = [];
      var middleWhite = false;
  
      for(var j = 0; j < num2; j++){
        const coordinate = (xFirst)? i*10+j : j*10+i;
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
      }
      result.push(currentCol);
    }
    return result;
  }
  var xNumbers = makeNumber(x, y, true);
  var yNumbers = makeNumber(y, x, false);

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
  res.redirect("/all-art");
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
  res.render("showgrid.ejs", {name: info.name, squares, x: info.x, y: info.y, url: `${req.protocol}://${req.get('host')}`})
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
  console.log(JSON.stringify(req.body));
  var squares = [[1, 1], [1, 1]];
  for(var i = 0; i < 2; i++){
    for(var j = 0; j < 2; j++){
      squares[j][i] = req.body[i + "-" + j];
      console.log(squares);


    }
  }
  console.log(squares);
  
  res.render("showgrid.ejs", {squares, x:2, y:2})
})
app.listen(port, (err) => {
    if (err) console.log(err);
    else console.log("Listening to port ", port);
})