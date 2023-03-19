const { tasks } = require('./data/tasks');
//required modules
const express = require('express');
// const fs = require('fs');
// const path = require('path');

const PORT = process.env.PORT || 3001;

const app = express();

// app.use(express.urlencoded ( { extended: true}));
// app.use(express.json());
// app.use(express.static('public'));

// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname,'./public/index.html'))
// });

// testing get route
app.get('/api/tasks', (req, res) => {
  res.json(tasks)
})

// testing query

function filterByQuery(query, tasksArray) {
  let filteredResults = tasksArray;
  if(query.description) {
    filteredResults = filteredResults.filter(task => task.description === query.description);
  }
  if(query.date) {
    filteredResults = filteredResults.filter(task => task.date === query.date);
  }
  if(query.status) {
    filteredResults = filteredResults.filter(task => task.status === query.status);
  }
  return filteredResults;
}

app.get('/tasks', (req, res) => {
  let results = tasks;
  if(req.query) {
    results = filterByQuery(req.query, results)
  }
  res.json(results)
})

//querying just descriptions? 
app.get('/descriptions', (req,res) => {
  const descriptions = tasks.map(task => task.description);
  res.send(descriptions)
})


app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
  });