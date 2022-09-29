//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/todolistDB');

const itemSchema = new mongoose.Schema({
  name: String
});

const Item = mongoose.model('item', itemSchema);

const Item1 = new Item ({
  name:'Welcome to your To-Do List!'
});

const Item2 = new Item ({
  name:'Hit the + button to add a new item'
});

const Item3 = new Item ({
  name:'<<-- Hit this to delete an item'
});

const defaultItems = [Item1, Item2, Item3];

const listSchema = {
  name: String,
  items: [itemSchema]
};

const List = mongoose.model("List", listSchema);


app.get("/", function(req, res) {

  Item.find({}, function(err, foundItems){

    if (foundItems.length === 0) {
      Item.insertMany(defaultItems,function (err){
        if (err) {
          console.log(err);
        } else {
          console.log("successfully added items");
        }
      });
      res.redirect("/");
    } else {
      res.render("list", {listTitle: "Today", newListItems: foundItems});
    }
  });


});

app.post("/", function(req, res){

const itemName = req.body.newItem;

const item = new Item({
  name: itemName
});

item.save();
res.redirect("/");
});

app.post("/delete", function(req, res){
  const checkedItemId = req.body.checkbox;

  Item.findByIdAndRemove(checkedItemId, function(err){
    if (!err) {
      console.log("successfully deleted checked item");
      res.redirect("/")
    }
    });
});

app.get("/:customListName", function(req,res){
  const customListName = req.params.customListName;

  const list = new List({
    name: customListName,
    items: defaultItems
  });

  list.save();

});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
