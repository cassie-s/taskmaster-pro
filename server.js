const { tasks } = require('./data/tasks');
//required modules
const express = require('express');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.urlencoded ( { extended: true}));
app.use(express.json());
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

function findById(id, tasksArray) {
  const result = tasksArray.filter(task => task.id === id)[0];
  return result;
}

function createNewTask(body, tasksArray){
  const task = body;
  tasksArray.push(task);
  fs.writeFileSync(
    path.join(__dirname, './data/tasks.json'),
    JSON.stringify({ tasks: tasksArray }, null, 2)
  );
  return task;
}

function validateTask(task) {
  if (!task.description || typeof task.description !== 'string') {
    return false;
  }
  if (!task.date || typeof task.date !== 'string') {
    return false;
  }
  if (!task.status || typeof task.status !== 'string') {
    return false;
  }
  return true;
}

app.get('/tasks', (req, res) => {
  let results = tasks;
  if(req.query) {
    results = filterByQuery(req.query, results)
  }
  res.json(results)
})


app.get('/api/tasks/:id', (req,res) => {
  const result = findById(req.params.id, tasks);
  if (result) {
  res.json(result);
  } else {
    res.sendStatus(404);
  }
})

app.post('/api/tasks', (req, res) => {
  // set id based on what the next index of the array will be
  req.body.id = tasks.length.toString();
  
  // if any data in req.body is incorrect, send 400 error back
  if(!validateTask(req.body)){
    res.status(400).send('The task is not properly formatted.');
  } else {
    const task = createNewTask(req.body, tasks);
    res.json(task);
  }
});


app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
  });

