const twilio = require("twilio");
const express = require("express");
const app = express();
const port = 3000;

const client = new twilio(
  "AC6351333961310ff8225939d91d9a2f0f",
  "17c45a9c1d62b334e68dde80ff45a42d"
);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/text-verification", (req, res) => {
  console.log(req.body);
  console.log(req.body.phoneNumber);
  /*
  client.messages.create({
    to: "7812010366",
    from: "2542697771",
    body: "What's poppin",
  });
  */

  res.send("Done!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// get phone number, send back code that is valid for certain amount of time
// get code, send back if valid or not
