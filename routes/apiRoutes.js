var db = require("../models");

module.exports = function(app) {
  // Get all examples
  app.post("/api/user", function(req, res) {
    console.log(req.body.email);
    //db.user needs to equal "user" in defining sequelize var
    //if it was "User" then it would be db.User
    db.user.findOne({ where: { name: req.body.email } }).then(function(dbuser) {
      res.json(dbuser);
      console.log("this is from apiroutes.js " + dbuser);
    });
  });

  app.post("/api/newUser", function(req, res) {
    db.user.create(req.body);
    res.end();
  });
  // Create a new example
  // app.post("/api/examples", function(req, res) {
  //   db.Example.create(req.body).then(function(dbExample) {
  //     res.json(dbExample);
  //   });
  // });

  // // Delete an example by id
  // app.delete("/api/examples/:id", function(req, res) {
  //   db.Example.destroy({ where: { id: req.params.id } }).then(function(dbExample) {
  //     res.json(dbExample);
  //   });
  // });
};
