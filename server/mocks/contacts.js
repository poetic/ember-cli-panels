module.exports = function(app) {
  var express = require('express');
  var contactsRouter = express.Router();

  contactsRouter.get('/', function(req, res) {
    // Simulate delay
    setTimeout(function() {
      res.send({
        "contacts": [
          {
            id: 0,
            name: "Bart Kowalski"
          }, {
            id: 1,
            name: "Lauren Schott"
          }, {
            id: 2,
            name: "John Goodman"
          }
        ]
      });
    }, 3000);
  });

  contactsRouter.post('/', function(req, res) {
    res.status(201).end();
  });

  contactsRouter.get('/:id', function(req, res) {
    res.send({
      "contacts": {
        "id": req.params.id
      }
    });
  });

  contactsRouter.put('/:id', function(req, res) {
    res.send({
      "contacts": {
        "id": req.params.id
      }
    });
  });

  contactsRouter.delete('/:id', function(req, res) {
    res.status(204).end();
  });

  app.use('/api/contacts', contactsRouter);
};
