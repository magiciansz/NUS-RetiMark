const sequelize = require("./config/database");
const app = require("./appconfig");
sequelize
  //.sync({force : true})
  .sync()
  .then(() => {
    app.listen(process.env.PORT);
    //pending set timezone
    console.log("Listening on Port" + process.env.PORT);
  })
  .catch((err) => {
    console.log(err);
  });
