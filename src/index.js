const mongoose = require("mongoose");
require("dotenv").config();

const server = require("./server");

const app = server.createExpressServer();

const DB_URI = process.env.DATABASE_URI || "mongodb://localhost/contacts";

const DB_CONNECTION_STRING = !!process.env.DATABASE_URI
  ? "(remote)"
  : "(local)";

// Connect to Mongoose and set connection variable
mongoose.connect(DB_URI, { useNewUrlParser: true });
var db = mongoose.connection;

// Added check for DB connection
if (!db) console.log("Error connecting db " + DB_CONNECTION_STRING);
else console.log("Db connected successfully " + DB_CONNECTION_STRING);

// Setup server port
var port = process.env.PORT || 8080;

// Launch app to listen to specified port
app.listen(port, function () {
  console.log("Running OTOT-task B1-B2 on http://localhost:" + port);
});
