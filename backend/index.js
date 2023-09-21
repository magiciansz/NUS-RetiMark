const sequelize = require("./config/database");
const app = require("./appconfig");
sequelize
  //.sync({force : true})
  .sync()
  .then(() => {
    app.listen(process.env.DOCKER_PORT);
    //pending set timezone
    console.log(
      "App listening on port " +
        process.env.DOCKER_PORT +
        " within the container"
    );
    console.log(
      "The port " +
        process.env.DOCKER_PORT +
        " is mapped to local port " +
        process.env.LOCAL_PORT
    );
  })
  .catch((err) => {
    console.log(err);
  });
