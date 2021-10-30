const { MongoClient } = require("mongodb");
const express = require("express");
const app = express();
const port = process.env.PORT || 5000;

const cors = require("cors");
// middleware
app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://mydbuser1:nnsYpp9DI2SJ91q5@janaalam.ewacz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();

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
