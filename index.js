const { MongoClient } = require("mongodb");
const express = require("express");
const app = express();
const port = process.env.PORT || 5000;

const cors = require("cors");
// middleware
app.use(cors());
app.use(express.json());
// calling environment variable
require("dotenv").config();
// Object Id

const ObjectId = require("mongodb").ObjectId;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@janaalam.ewacz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();

    console.log("Connected with database");
    // database & collections
    const database = client.db("sailout");
    const tours = database.collection("tours");

    // Get Api
    app.get("/tours", async (req, res) => {
      const cursor = tours.find({});
      const result = await cursor.toArray();
      console.log(result);
      res.json(result);
    });
    // Get Api by _id
    app.get("/booking/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const tour = await tours.findOne(query);
      res.json(tour);
    });

    // Post Api
    app.post("/tours", async (req, res) => {
      const newTour = req.body;
      console.log(newTour);
      const result = await tours.insertOne(newTour);
      console.log(result);
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Server is running from localhost 5000 & heroku");
});

app.listen(port, () => {
  console.log("Server Running in port", port);
});
