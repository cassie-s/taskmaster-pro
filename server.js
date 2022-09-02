//required modules
const express = require('express');
const fs = require('fs');
const { networkInterfaces } = require('os');
const path = require('path');

const PORT = process.env.PORT || 3003;

const app = express();

app.use(express.urlencoded ( { extended: true}));
app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname,'./public/index.html'))
});

//display all tasks
app.get('/api/tasks', function (req, res) {
  fs.readFile("db/db.json", "utf8", function (err, tasks){
    if (err) {
      console.log(err)
      return
    }
    res.json(JSON.parse(tasks))
  })
})

//posting task to db.json
app.post('/api/tasks', function (req, res){
  const newTask = req.body
  let tasksDB = []
  fs.readFile(path.join(__dirname + '/db/db/json'), "utf8", function (err, data) {
    if (err) {
      return console.log(err);
    }
    if (data === "") {
      tasksDB.push({ "id": 1, "title": newTask.title, "text": newTask.text })
    } else {
      tasksDB = JSON.parse(data);
      tasksDB.push({ "id": tasksDB.length + 1, "title": newTask.title, "text": newTask.text });
    }
    //updated tasks pushed to db.json
    fs.writeFile((path.join(__dirname + "/db/db.json")), JSON.stringify(tasksDB), function (error) {
      if (error) { return console.log(error); }
      res.json(tasksDB);
    });
  });
});

// delete tasks
app.delete("/api/tasks/:id", function (req, res) {
  const newTask = req.body
  const taskID = req.params.id
  let tasksDB = []
  fs.readFile(path.join(__dirname + "/db/db.json"), "utf8", function (err, data) {
      if (err) {
          return console.log(err);
      }
      tasksDB = JSON.parse(data);
      tasksDB = notesDB.filter(function(object){
          return object.id != tasksID
      })

      // updated notes pushed to db.json
      fs.writeFile((path.join(__dirname + "/db/db.json")), JSON.stringify(tasksDB), function (error) {
          if (error) { return console.log(error); }
          res.json(tasksDB);
      });
  });
});



app.listen(3001, () => {
    console.log(`API server now on port 3001!`);
  });