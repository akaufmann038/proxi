const twilio = require("twilio");
const express = require("express");
const redis = require("redis");
var Mutex = require("async-mutex").Mutex;
const app = express();
const port = 3000;

const mutex = new Mutex();

// connecting to redis client
const redisClient = redis.createClient();
redisClient.on("error", (err) => console.log("Redis Client Error", err));
redisClient.connect();

// stores codes and when they are activated
// { phoneNumber: { "code": code, "createdAt": when code was created } }
const activeCodes = {};

const client = new twilio(
  "AC6351333961310ff8225939d91d9a2f0f",
  "17c45a9c1d62b334e68dde80ff45a42d"
);

app.use(express.json({ limit: "50mb" }));

app.get("/", (req, res) => {
  res.json({ message: "sup bruv" });
});

app.post("/test", async (req, res) => {
  //setTimeout(() => console.log(new Date()), 1000);
  console.log("server says hi");
  res.json({ message: "sup bruv" });
});

app.post("/send-event-photo", (req, res) => {
  console.log(req.body["photo"]);

  res.send("success");
});

// the keys that are used in the redis database, make all requests
// with these
const redisKeys = {
  events: () => "events",
  user: (userId) => "user:" + userId,
  event: (eventId) => "event:" + eventId,
  users: () => "users",
  registeredEvents: (userId) => "user:" + userId + ":events",
};

// registers a user for an event and sends back the list of registered events for that user
app.post("/register-event", async (req, res) => {
  // ensure that all fields are present and spelled correctly
  if (!("phoneNumber" in req.body) || !("eventId" in req.body)) {
    return res.json({ success: false, message: "Invalid fields!" });
  }

  try {
    // get user id given phone number
    const userId = await redisClient.get(req.body["phoneNumber"]);

    // add event id to user's registered events in db
    await redisClient.rPush(
      redisKeys.registeredEvents(userId),
      String(req.body["eventId"])
    );

    // gets all registered events for given user
    const registeredEvents = await redisClient.lRange(
      redisKeys.registeredEvents(userId),
      0,
      -1
    );

    return res.json({
      success: true,
      message: "Successfully registered user for event in database",
      registeredEvents: registeredEvents,
    });
  } catch (err) {
    console.log(err);

    return res.json({
      success: false,
      message:
        "there was an error while registering the user for an event in database",
    });
  }
});

// returns all events and the events for which the user has registered for
app.post("/get-feed", async (req, res) => {
  // ensure that all fields are present and spelled correctly
  if (!("phoneNumber" in req.body)) {
    return res.json({ success: false, message: "Invalid fields!" });
  }

  try {
    // get user id of given phone number
    const userId = await redisClient.get(req.body["phoneNumber"]);

    // get all events in the database
    const eventIds = await redisClient.lRange(redisKeys.events(), 0, -1);

    let eventData = [];

    eventIds.forEach(async (eventId) => {
      const data = await redisClient.hGetAll(redisKeys.event(eventId));
      eventData.push(data);
    });

    // get id's of events which user is registered for
    const registered = await redisClient.lRange(
      redisKeys.registeredEvents(userId),
      0,
      -1
    );

    return res.json({
      success: true,
      message: "Successfully retrieved feed from database",
      eventData: eventData,
      registered: registered,
    });
  } catch (err) {
    console.log(err);

    return res.json({
      success: false,
      message: "there was an error while getting the feed from the database",
    });
  }
});

app.post("/create-event", async (req, res) => {
  // ensure that all fields are present and spelled correctly
  if (
    !("name" in req.body) ||
    !("date" in req.body) ||
    !("location" in req.body) ||
    !("hostedBy" in req.body) ||
    !("hostedByImage" in req.body) ||
    !("overview" in req.body) ||
    !("public" in req.body) ||
    !("photo" in req.body) || // base64 string
    !("tags" in req.body)
  ) {
    return res.json({ success: false, message: "Invalid fields!" });
  }

  const release = await mutex.acquire();

  // get last id added to head of the list
  const lastId = await redisClient.lRange(redisKeys.events(), 0, 0);
  let newId;

  // create id for event
  if (lastId.length == 0) {
    newId = 1;
  } else {
    newId = parseInt(lastId[0]) + 1;
  }

  const newEventCode = Math.floor(1000 + Math.random() * 9000);

  try {
    await redisClient
      .MULTI()
      .lPush(redisKeys.events(), String(newId))
      .hSet(redisKeys.event(newId), {
        id: String(newId),
        name: req.body["name"],
        date: String(req.body["date"]),
        location: req.body["location"],
        hostedBy: req.body["hostedBy"],
        hostedByImage: req.body["hostedByImage"],
        overview: req.body["overview"],
        public: String(req.body["public"]),
        eventCode: String(newEventCode),
        photo: req.body["photo"],
        tags: req.body["tags"],
      })
      .exec();

    release();

    return res.json({
      success: true,
      message: "successfully created event in database",
    });
  } catch (err) {
    console.log(err);

    release();

    return res.json({
      success: false,
      message: "there was an error while creating event in database",
    });
  }
});

app.post("/register-full-user", async (req, res) => {
  // ensure that all fields are present and spelled correctly
  if (
    !("phoneNumber" in req.body) ||
    !("fullName" in req.body) ||
    !("jobTitle" in req.body) ||
    !("company" in req.body) ||
    !("location" in req.body) ||
    !("email" in req.body) ||
    !("sharePhone" in req.body) ||
    !("links" in req.body)
  ) {
    return res.json({
      success: false,
      message: "Invalid fields!",
    });
  }

  // ensure that phone number can't register twice
  const exists = await redisClient.EXISTS(req.body["phoneNumber"]);
  if (exists > 0) {
    return res.json({
      success: false,
      message: "Phone number already registered",
    });
  }

  // get last id added to head of the list
  const lastId = await redisClient.lRange(redisKeys.users(), 0, 0);
  let newId;

  // create id for user
  if (lastId.length == 0) {
    newId = 1;
  } else {
    newId = parseInt(lastId[0]) + 1;
  }

  try {
    await redisClient
      .MULTI()
      .lPush(redisKeys.users(), String(newId))
      .hSet(redisKeys.user(newId), {
        id: String(newId),
        phoneNumber: req.body["phoneNumber"],
        fullName: req.body["fullName"],
        jobTitle: req.body["jobTitle"],
        company: req.body["company"],
        location: req.body["location"],
        email: req.body["email"],
        sharePhone: String(req.body["sharePhone"]),
        linkInstagram: req.body["links"]["Instagram"],
        linkLinkedin: req.body["links"]["Linkedin"],
        linkGithub: req.body["links"]["GitHub"],
        linkDropbox: req.body["links"]["DropBox"],
        linkMedium: req.body["links"]["Medium"],
        linkFacebook: req.body["links"]["Facebook"],
        linkInstagram: req.body["links"]["Instagram"],
        linkTiktok: req.body["links"]["Tiktok"],
      })
      .set(req.body["phoneNumber"], newId)
      .exec();

    return res.json({
      success: true,
      message: "successfully created user in database",
    });
  } catch (err) {
    console.log(err);

    return res.json({
      success: false,
      message: "there was an error while creating user in database",
    });
  }
});

// -------------------
// Non-redis methods

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

    return res.json({ success: true, verificationCode: String(code) });
  } else {
    return res.json({ success: false, message: "Incorrect body structure" });
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
      return res.json({
        success: false,
        message: "Phone number not recognized",
      });
    }

    // 1 and 3
    if (activeCodes[phoneNumber]["code"] != verificationCode) {
      return res.json({ success: false, message: "Invalid verification code" });
    }

    // 4
    if (Math.abs(activeCodes[phoneNumber]["createdAt"] - new Date()) > 300000) {
      return res.json({ success: false, message: "Code has expired" });
    }

    return res.json({ success: true, message: "Code is verified" });
  } else {
    return res.json({ success: false, message: "Incorrect body structure" });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
