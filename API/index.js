const twilio = require("twilio");
const express = require("express");
const app = express();
const port = 3000;

// stores codes and when they were activated
// { phoneNumber: { code: time created } }
const activeCodes = {};

const client = new twilio(
  "AC6351333961310ff8225939d91d9a2f0f",
  "17c45a9c1d62b334e68dde80ff45a42d"
);

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "sup bruv" });
});

// body must be object with one field, which must be phoneNumber
app.post("/get-code", (req, res) => {
  const fields = Object.keys(req.body);

  if (fields.length == 1 && fields[0] == "phoneNumber") {
    const phoneNumber = req.body.phoneNumber;

    // generate code and store it in server memory
    const code = Math.floor(Math.random() * 9000 + 1000);
    activeCodes[phoneNumber] = { code: new Date() };

    // text code to the client's phone number
    client.messages.create({
      to: String(phoneNumber),
      from: "2542697771",
      body:
        "Your Proxi verification code is " +
        String(code) +
        ". It is valid for the next 5 minutes.",
    });

    res.status(200).json({ verificationCode: code });
  } else {
    res.status(400).json({ message: "Incorrect body field!" });
  }
});

// body must be object with two fields, phoneNumber and verificationCode
app.post("/verify-code", (req, res) => {
  const fields = Object.keys(req.body);

  if (
    fields.length == 2 &&
    (fields[0] == "phoneNumber" || fields[1] == "phoneNumber") &&
    (fields[0] == "verificationCode" || fields[1] == "verificationCode")
  ) {
    const verificationCode = req.body.verificationCode;
    const phoneNumber = req.body.phoneNumber;

    // check if phoneNumber is valid (case where someone else is entering
    // clients code)
    if (!(phoneNumber in activeCodes)) {
      res.status(400).json({ message: "Invalid client code!" });
    }

    // check if 5 minutes have passed
    if (
      Math.abs(activeCodes[phoneNumber][verificationCode] - new Date()) > 300000
    ) {
      res.status(400).json({ message: "Code has expired!" });
    }

    res.status(200).json({ message: "Success. Code is verified!" });
  } else {
    res.status(400).json({ message: "Incorrect body field!" });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
