const express = require('express');
const helmet = require('helmet');
const knex = require('knex');

// Configure knex
const knexConfig = {
  client: 'sqlite3',
  connection: {
    filename: './data/lambda.sqlite3'
  },
  useNullAsDefault: true,
};

const db = knex(knexConfig);

const server = express();

server.use(express.json());
server.use(helmet());

// endpoints here

// (Create - new zoo)
server.post('/api/zoos', (req, res) => {
  db('zoos').insert(req.body, ['name'])
    .then(zoo => {
      res.status(200).json(zoo);
    })
    .catch(error => {
      res.status(404).json({ error: "Unable to add to the database try again.", error });
    });
});


// (Get - zoos)
server.get('/api/zoos', (req, res) => {
  db('zoos')
    .then(zoos => {
      res.status(201).json(zoos)
    })
    .catch(error => {
      res.status(404).json({ error: "Unable to retrieve the specified request." });
    });
});

// (Get - zoos by id)
server.get('/api/zoos/:id', (req, res) => {
  db('zoos').where({ id: req.params.id })
    .first()
    .then(zoo => {
      if (zoo) {
        res.status(201).json(zoo)
      } else {
        res.status(404).json({ message: "Zoo not found." });
      }
    })
    .catch(error => {
      res.status(404).json({ error: "The specified id does not exists." });
    });
});

// (Delete - zoos by id)
server.delete('/api/zoos/:id', (req, res) => {
  db('zoos').where({ id: req.params.id }).del(req.body)
    .then(count => {
      if (count > 0) {
        res.status(200).json(`${count} record deleted`);
      } else {
        res.status(404).json({ message: "Zoo does not exists" });
      }
    })
    .catch(error => {
      res.status(500).json({ error: "Unable to delete the specified id." });
    })
});

// (Put - update zoos by id)
server.put('/api/zoos/:id', (req, res) => {
  db('zoos').where({ id: req.params.id }).update(req.body)
    .then(count => {
      if (count > 0) {
        res.status(200).json({ message: `${count} record updated` });
      } else {
        res.status(404).json({ message: "Zoo does not exisit." });
      }
    })
    .catch(error => {
      res.status(500).json({ error: "Unable to updates the specified id." });
    })
});

// STRETCH \\

const port = 3300;
server.listen(port, function () {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
