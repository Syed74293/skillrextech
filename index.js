const express = require("express");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const bodyparser = require("body-parser");
app = express();

mongoose.connect("mongodb://localhost/restaurant");

const db = mongoose.connection;

db.on("error", console.error.bind(console, "Connection Error"));

db.once("open", () => {
  console.log("Connection Successful");
});

const menuSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

const Menu = mongoose.model("menuItem", menuSchema);

app.engine("html", require("ejs").renderFile);

app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.set("view engine", "ejs");
app.use(express.static("./"));
app.set("views", path.join(__dirname, "/"));

app.use("/stat", express.static("./"));

app.get("/", async (req, res) => {
  res.status(200).render("./html/index.html");
});

app.get("/cart", async (req, res) => {
  res.status(200).render("./html/cart.html");
});

app.post("/cart", async (req, res) => {
  console.log(req.body.data);
  Menu.find({id: req.body.data}).then(element=>{
    element.forEach(data=>{
      console.log(data.id);
      console.log(data.name);
      console.log(data.desc);
      console.log(data.price);
      res.status(200).send({id: data.id, name: data.name, price: data.price});
    });
  });
});

app.get("/menu", async (req, res) => {
  res.status(200).render("./html/menu.html");
});

// let data = fs.readFileSync("./output.json", "utf-8");

// data = JSON.parse(data);

// data.forEach((element) => {
//   console.log(element);
//   new Menu({
//     id: element.id,
//     name: element.name,
//     desc: element.desc,
//     price: element.price,
//   }).save();
// });

// new Menu({
//   id: 2,
//   image: imageBuffer,
//   item: "Background",
//   desc: "Any Background",
//   price: 12,
// }).save();

app.listen(3000, '0.0.0.0', () => {
  console.log("Dude Im alive.......");
});

// const fs = require("fs");
// const cheerio = require("cheerio");

// // Load your HTML content
// const htmlContent = fs.readFileSync("./html/menu.html", "utf-8");

// // Load HTML content into Cheerio
// const $ = cheerio.load(htmlContent);

// // Define the structure of your JSON data
// const jsonData = [];

// // Iterate over elements with data-id attribute
// $(".menucards").each((index, element) => {
//   // Extract id, name, desc, and price
//   $(element).find('.size-option').each((i, e)=>{
//     const id = $(e).attr("data-id");
//     const name = $(element).find("h2").text().trim();
//     const desc = $(e).text().trim() + ', ' + $(element).find("h5").text().trim();
//     const price = $(e).attr('value');
//     jsonData.push({ id, name, desc, price });
//   })

//   // Push data to JSON
// });

// // Save JSON data to a file
// fs.writeFileSync("data.json", JSON.stringify(jsonData, null, 2));

// console.log("Data extracted and saved to output.json");
