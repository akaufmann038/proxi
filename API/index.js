const twilio = require("twilio");
const express = require("express");
const app = express();
const port = 3000;

// stores codes and when they are activated
// { phoneNumber: { "code": code, "createdAt": when code was created } }
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

  // ensure that object has one field, phoneNumber
  if (fields.length == 1 && fields[0] == "phoneNumber") {
    const phoneNumber = req.body.phoneNumber;

    // generate code and store it in server memory
    const code = Math.floor(Math.random() * 9000 + 1000);
    activeCodes[phoneNumber] = { code: code, createdAt: new Date() };

    // text code to the client's phone number
    client.messages.create({
      to: String(phoneNumber),
      from: "2542697771",
      body:
        "Your Proxi verification code is " +
        String(code) +
        ". It is valid for the next 5 minutes.",
    });

    res.json({ success: true, verificationCode: String(code) });
  } else {
    res.json({ success: false, message: "Incorrect body structure" });
  }
});

// body must be object with two fields, phoneNumber and verificationCode
app.post("/verify-code", (req, res) => {
  const fields = Object.keys(req.body);

  // ensure that object has two fields, phoneNumber and verificationCode
  if (
    fields.length == 2 &&
    (fields[0] == "phoneNumber" || fields[1] == "phoneNumber") &&
    (fields[0] == "verificationCode" || fields[1] == "verificationCode")
  ) {
    const verificationCode = req.body.verificationCode;
    const phoneNumber = req.body.phoneNumber;

    // cases to cover
    // 1. a phone number enters another existing code (rare but gotta cover all cases)
    // 2. a phone number that has never generated a code before sends a request with a code
    // 3. the code does not match the number
    // 4. code has expired

    // 2
    if (!(phoneNumber in activeCodes)) {
      // TODO: figure out how to actually do response messages correctly and
      // fix that cannot set headers error (happens when incorrect code is sent)
      res.json({ success: false, message: "Phone number not recognized" });
    }

    // 1 and 3
    if (activeCodes[phoneNumber]["code"] != verificationCode) {
      res.json({ success: false, message: "Invalid verification code" });
    }

    // 4
    if (Math.abs(activeCodes[phoneNumber]["createdAt"] - new Date()) > 300000) {
      res.json({ success: false, message: "Code has expired" });
    }

    res.json({ success: true, message: "Code is verified" });
    console.log("and this");
  } else {
    res.json({ success: false, message: "Incorrect body structure" });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
