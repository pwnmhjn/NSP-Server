import { mongoDB } from "./db/index.db.js";
import { app } from "./app.js";

mongoDB()
  .then(() => {
    app.listen(process.env.PORT || 3000, () => {
      console.log(`app is listing on port number ${process.env.PORT}  `);
    });
  })
  .catch((err) => {
    console.log(`MongoDb Connection Failed ${err}`);
  });
