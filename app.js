var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var app = express();

// mongoose DB
mongoose.connect("mongodb://delta:bear1030@ds149279.mlab.com:49279/deltax");
var db = mongoose.connection;
db.once("open", function() {
  console.log("DB connected!");
});
db.on("error", function(err) {
  console.log("DB Error!",  err);
});

var dataSchema = mongoose.Schema({
  name : String,
  count: Number
});

var Data = mongoose.model('data', dataSchema);
Data.findOne({name:"myData"}, function(err,data) {
  if(err) return console.log("Data Error1:", err);

  if(!data){
    Data.create({name:"myData", count:0}, function(err,data){
      if(err) return console.log("Data Error2:", err);
      console.log("Counter initializes : ", data);
    });
  }
});

// EJS
app.set("view engine", 'ejs');
app.use(express.static(path.join(__dirname+'/public')));

app.get('/', function (req,res) {
  incCounter(res);
});
app.get('/reset', function (req,res) {
  setCounter(res,0);
});
app.get('/set/count', function (req,res) {
  if (req.query.count)
    setCounter(res, req.query.count);
  else
    getCounter(res);
});
app.get('/set/:num', function (req,res) {
  if (req.params.num) setCounter(res, req.params.num);
  else getCounter(res);
});

function incCounter(res) {
  console.log("incCounter");
  Data.findOne({name:"myData"}, function (err, data) {
    if(err) return console.log("Data Error", err);
    data.count++;
    data.save(function (err) {
      if(err) return console.log("Data Error", err);
      res.render('my_first_ejs', data);
    });
  });
}

function setCounter(res,num) {
  console.log("setCounter");
  Data.findOne({name:"myData"}, function (err, data) {
    if(err) return console.log("Data Error", err);
    data.count=num;
    data.save(function (err) {
      if(err) return console.log("Data Error", err);
      res.render('my_first_ejs', data);
    });
  });
}

function getCounter(res) {
  console.log("getCounter");
  Data.findOne({name:"myData"}, function (err, data) {
    if(err) return console.log("DataError", err);
    res.render('my_first_ejs', data);
  });
}
app.listen(3000, function(){
  console.log('Server On!');
});
