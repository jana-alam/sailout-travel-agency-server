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
    const tourCollection = database.collection("tours");
    const bookingCollection = database.collection("bookings");

    // Get Api
    app.get("/tours", async (req, res) => {
      const cursor = tourCollection.find({});
      const result = await cursor.toArray();
      res.json(result);
    });

    // Get Api by _id
    app.get("/tour/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const tour = await tourCollection.findOne(query);
      res.json(tour);
    });
    // Get Api to booking by user
    app.get("/bookings/user/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const cursor = bookingCollection.find(query);
      const result = await cursor.toArray();
      console.log(result);
      res.json(result);
    });
    // Get Api for all bookings

    app.get("/bookings/all", async (req, res) => {
      const cursor = bookingCollection.find({});
      const bookings = await cursor.toArray();
      res.json(bookings);
    });

    // Post Api
    app.post("/tours", async (req, res) => {
      const newTour = req.body;
      const result = await tourCollection.insertOne(newTour);
      res.json(result);
    });
    // Post Api for orders

    app.post("/booking", async (req, res) => {
      const booking = req.body;
      const result = await bookingCollection.insertOne(booking);
      console.log(result);
      res.json(result);
    });

    // Update API for booking update
    app.put("/bookings/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          status: "confirmed",
        },
      };
      const result = await bookingCollection.updateOne(
        filter,
        updatedDoc,
        options
      );
      console.log(result);
      res.json(result);
    });

    // delete api for bookings

    app.delete("/bookings/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await bookingCollection.deleteOne(query);
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
