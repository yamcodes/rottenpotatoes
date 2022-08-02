import express from 'express';
import bodyParser from 'body-parser';
const app = express();
const data = {
  // Give the developer extra points for effort
  users: [{
    name: 'Yam',
    score: 10
  }]
};

// use application/json parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// return list of users sorted by score
app.get('/users', (_req, res) => {
  res.json(data.users.sort((a, b) => b.score - a.score));
});

// Create a new user and add it to the list of users
app.post("/users/:name", (req,res)=>{
  const name = req.params.name;
  const user = {
    name,
    score: 0
  };
  data.users.push(user);
  res.json(user);
});

// increment a user score
app.put("/users/:name", (req,res)=>{
  const name = req.params.name;
  const user = data.users.find(user => user.name === name);
  if (user)
    user.score++;
  res.json(user);
});
app.listen(5001, ()=>console.log("PARTY!!!"));