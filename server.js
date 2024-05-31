const express = require("express");
const mysql = require("mysql2");
var bodyParser = require("body-parser");

const app = express();

// Set the view engine to EJS
app.set("view engine", "ejs");

// Middleware to parse incoming request bodies
app.use(express.urlencoded({ extended: false }));

app.use(bodyParser.json());

const port = 8080;

const connection = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

connection.connect();

app.get("/", (req, res) => {
  // Query to fetch users
  const query = "SELECT * FROM users order by id desc";

  // Execute the query
  connection.query(query, (error, results) => {
    if (error) {
      console.error("Error executing query: " + error.stack);
      return;
    }
    // Render the 'users' view with the retrieved data
    res.render("form", { items: results });
  });
});

app.post("/", function (req, res) {
  if (req.body) {
    connection.query(
      "INSERT INTO users (username, email) VALUES ('" +
        req.body.username +
        "', '" +
        req.body.email +
        "')",
      (error, results, fields) => {
        if (error) {
          throw error;
        }
      }
    );
  }
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
