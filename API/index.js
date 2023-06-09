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
  connections: (userId) => "user:" + userId + ":connections",
  connectionRequests: (userId) => "user:" + userId + ":requests",
};

// given object of hash keys and key-properties, returns all of the properties
// { hashKey,id or phoneNumber: [property1, property2...], hashKey2,id: [...] }
// returns values in same object format with values in same order as queried:
// { hashKey,id: [value1, value2...], hashKey2,id: [...] }
app.post("/query-hash-data", async (req, res) => {
  // ensure that all fields are present and spelled correctly
  if (!("hashData" in req.body)) {
    return res.json({ success: false, message: "Invalid fields!" });
  }

  try {
    let hashData = {};

    // iterate through every key
    for (const key of Object.keys(req.body["hashData"])) {
      const keyData = key.split(","); // key first, id second

      if (!(keyData[0] in redisKeys)) {
        return res.json({ success: false, message: "Invalid redis key" });
      }

      if (keyData[1].length > 5 && keyData[0] != "user") {
        return res.json({
          success: false,
          message: "Given phone number but not querying user",
        });
      }

      hashData[key] = [];

      let resData;
      // if phone number
      if (keyData[1].length > 5) {
        const userId = await redisClient.get(keyData[1]);

        resData = await redisClient.hmGet(
          redisKeys[keyData[0]](userId),
          req.body["hashData"][key]
        );
      } else {
        resData = await redisClient.hmGet(
          redisKeys[keyData[0]](keyData[1]),
          req.body["hashData"][key]
        );
      }
      hashData[key] = resData;
    }

    return res.json({
      success: true,
      message: "Successfully queried hash data from database",
      hashData: hashData,
    });
  } catch (err) {
    console.log(err);

    return res.json({
      success: false,
      message: "there was an error while querying hash data from database",
    });
  }
});

// a user requests to connect with another user
app.post("/connection-request", async (req, res) => {
  // ensure that all fields are present and spelled correctly
  if (
    !("phoneNumber" in req.body) ||
    !("otherUserId" in req.body) ||
    !("eventId" in req.body)
  ) {
    return res.json({ success: false, message: "Invalid fields!" });
  }

  try {
    // get user id of given phone number
    const userId = await redisClient.get(req.body["phoneNumber"]);

    // ensure that client can't request to connect with themselves
    if (userId == String(req.body["otherUserId"])) {
      return res.json({
        success: false,
        message: "Cannot request to connect with the same user",
      });
    }

    const release = await mutex.acquire();

    // ensure that client can't request to connect with someone
    // who they're already connected with (only need to check one case since both
    // clients shoudl have a connection on their end)
    const connectionExists = await redisClient.hExists(
      redisKeys.connections(userId),
      String(req.body["otherUserId"])
    );

    if (connectionExists == "1") {
      return res.json({
        success: false,
        message:
          "Cannot request to connect with a user who is already a connection",
      });
    }

    // ensure that client can't request to connect with someone
    // who they already sent a request to
    const requestExists = await redisClient.hExists(
      redisKeys.connectionRequests(req.body["otherUserId"]),
      userId
    );

    if (requestExists == "1") {
      return res.json({
        success: false,
        message:
          "Cannot request to connect with a user who is already requested",
      });
    }

    // ensure that client can't request to connect with someone
    // who has already requested them
    // 1 -> 2 user:2:requests = { 1: eventId }
    // 2 -> 1
    const alreadyRequested = await redisClient.hExists(
      redisKeys.connectionRequests(userId),
      String(req.body["otherUserId"])
    );

    if (alreadyRequested == "1") {
      return res.json({
        success: false,
        message:
          "Cannot request to connect with a user who already requested to connect with you",
      });
    }

    // add object to connection requests for other user
    await redisClient.hSet(
      redisKeys.connectionRequests(req.body["otherUserId"]),
      userId,
      req.body["eventId"]
    );

    release();

    return res.json({
      success: true,
      message: "Successfully added connection request to database",
    });
  } catch (err) {
    console.log(err);

    return res.json({
      success: false,
      message:
        "there was an error while requesting to connect with user in database",
    });
  }
});

// returns all connections and connection requests for a given user
app.post("/get-connections-all", async (req, res) => {
  // ensure that all fields are present and spelled correctly
  if (!("phoneNumber" in req.body)) {
    return res.json({ success: false, message: "Invalid fields!" });
  }

  try {
    // get user id of given phone number
    const userId = await redisClient.get(req.body["phoneNumber"]);

    // TODO: COMBINE THESE
    // get connection requests for that user
    const connectionRequests = await redisClient.hGetAll(
      redisKeys.connectionRequests(userId)
    );

    // get connections for that user
    const connections = await redisClient.hGetAll(
      redisKeys.connections(userId)
    );

    return res.json({
      success: true,
      message:
        "Successfully retrieved connections and connection requests from database",
      connectionRequests: connectionRequests,
      connections: connections,
    });
  } catch (err) {
    console.log(err);

    return res.json({
      success: false,
      message:
        "there was an error while getting connections and connection requests from database",
    });
  }
});

app.post("/reject-request", async (req, res) => {
  // ensure that all fields are present and spelled correctly
  if (!("phoneNumber" in req.body) || !("otherUserId" in req.body)) {
    return res.json({ success: false, message: "Invalid fields!" });
  }

  try {
    // get user id of given phone number
    const userId = await redisClient.get(req.body["phoneNumber"]);

    // get rid of object connectionRequests
    const deletedResult = await redisClient.hDel(
      redisKeys.connectionRequests(userId),
      req.body["otherUserId"]
    );

    if (deletedResult == "0") {
      return res.json({
        success: false,
        message: "trying to reject request that does not exist",
      });
    }

    const pendingConnectionCount = await redisClient.hLen(
      redisKeys.connectionRequests(userId)
    );

    return res.json({
      success: true,
      message: "sucessfully rejected connection request in database",
      result: pendingConnectionCount,
    });
  } catch (err) {
    console.log(err);

    return res.json({
      success: false,
      message:
        "there was an error while rejecting the connection in the database",
    });
  }
});

// accepts requesting connection from another user
app.post("/accept-request", async (req, res) => {
  // ensure that all fields are present and spelled correctly
  if (
    !("phoneNumber" in req.body) ||
    !("otherUserId" in req.body) ||
    !("eventId" in req.body)
  ) {
    return res.json({ success: false, message: "Invalid fields!" });
  }

  try {
    // get user id of given phone number
    const userId = await redisClient.get(req.body["phoneNumber"]);

    // 1. ensures that client can't accept request that doesn't exist
    // 2. ensures that client can't accept request if a connection already exists
    const testCase = await redisClient
      .MULTI()
      .hExists(
        redisKeys.connectionRequests(userId),
        String(req.body["otherUserId"])
      )
      .hExists(redisKeys.connections(userId), String(req.body["otherUserId"]))
      .hExists(redisKeys.connections(req.body["otherUserId"]), userId)
      .exec();

    if (testCase[0] == "0") {
      return res.json({
        success: false,
        message: "Trying to accept connection request that does not exist",
      });
    }

    if (testCase[1] == "1" || testCase[2] == "1") {
      return res.json({
        success: false,
        message:
          "Trying to accept connection request when a connection already exists between the two users",
      });
    }

    const release = await mutex.acquire();

    // 1. delete corresponding object in connection requests for current user
    // 2. create connection object in connections for current user and other user
    await redisClient
      .MULTI()
      .hDel(
        redisKeys.connectionRequests(userId),
        String(req.body["otherUserId"])
      )
      .hSet(
        redisKeys.connections(userId),
        String(req.body["otherUserId"]),
        String(req.body["eventId"])
      )
      .hSet(
        redisKeys.connections(req.body["otherUserId"]),
        userId,
        String(req.body["eventId"])
      )
      .exec();

    release();

    const pendingConnectionCount = await redisClient.hLen(
      redisKeys.connectionRequests(userId)
    );

    return res.json({
      success: true,
      message: "Successfully accepted connection in database",
      result: pendingConnectionCount,
    });
  } catch (err) {
    console.log(err);

    return res.json({
      success: false,
      message:
        "there was an error while accepting connection request in the database",
    });
  }
});

// gets all data needed for the pending connections page
app.post("/pending-connections-page", async (req, res) => {
  // ensure that all fields are present and spelled correctly
  if (!("phoneNumber" in req.body)) {
    return res.json({ success: false, message: "Invalid fields!" });
  }

  try {
    // get user id of given phone number
    const userId = await redisClient.get(req.body["phoneNumber"]);

    // get all pending connections for this user
    const pendingConnections = await redisClient.hGetAll(
      redisKeys.connectionRequests(userId)
    );

    let result = {};
    result["pendingConnectionsData"] = [];

    for (const connUserId of Object.keys(pendingConnections)) {
      const connEventId = pendingConnections[connUserId];

      const userData = await redisClient.hmGet(redisKeys.user(connUserId), [
        "photo",
        "fullName",
        "jobTitle",
      ]);
      const eventData = await redisClient.hmGet(redisKeys.event(connEventId), [
        "name",
        "date",
      ]);

      result["pendingConnectionsData"].push({
        photo: userData[0],
        fullName: userData[1],
        jobTitle: userData[2],
        eventName: eventData[0],
        eventDate: eventData[1],
        eventId: connEventId,
        connUserId: connUserId,
      });
    }

    return res.json({
      success: true,
      message:
        "succesfully retrieved all data needed for PendingConnections page",
      result: result,
    });
  } catch (err) {
    console.log(err);

    return res.json({
      success: false,
      message:
        "there was an error while getting all the data for the PendingConnections page",
    });
  }
});

// gets all data needed for the connections page
app.post("/connections-page", async (req, res) => {
  // ensure that all fields are present and spelled correctly
  if (!("phoneNumber" in req.body)) {
    return res.json({ success: false, message: "Invalid fields!" });
  }

  try {
    // get user id of given phone number
    const userId = await redisClient.get(req.body["phoneNumber"]);

    const pendingConnectionCount = await redisClient.hLen(
      redisKeys.connectionRequests(userId)
    );

    // get all connections for this user
    const connections = await redisClient.hGetAll(
      redisKeys.connections(userId)
    );

    let result = {};
    result["pendingConnectionCount"] = pendingConnectionCount;
    result["connectionsData"] = [];

    for (const connUserId of Object.keys(connections)) {
      const connEventId = connections[connUserId];

      const userData = await redisClient.hmGet(redisKeys.user(connUserId), [
        "photo",
        "fullName",
      ]);
      const eventName = await redisClient.hGet(
        redisKeys.event(connEventId),
        "name"
      );

      result["connectionsData"].push({
        photo: userData[0],
        fullName: userData[1],
        eventName: eventName,
        connUserId: connUserId,
      });
    }

    return res.json({
      success: true,
      message: "succesfully retrieved all data needed for Connections page",
      result: result,
    });
  } catch (err) {
    console.log(err);

    return res.json({
      success: false,
      message:
        "there was an error while getting the data for the Connections page",
    });
  }
});

// registers a user for an event and sends back the list of registered events for that user
app.post("/register-event", async (req, res) => {
  // ensure that all fields are present and spelled correctly
  if (!("phoneNumber" in req.body) || !("eventId" in req.body)) {
    return res.json({ success: false, message: "Invalid fields!" });
  }

  try {
    // get user id given phone number
    const userId = await redisClient.get(req.body["phoneNumber"]);

    // get public and eventCode fields for event to register for
    const currentEvent = await redisClient.hmGet(
      redisKeys.event(req.body["eventId"]),
      ["public", "eventCode"]
    );

    if (currentEvent[0] == "false") {
      if (!("eventCode" in req.body)) {
        return res.json({
          success: false,
          message: "Trying to register for private event without event code.",
        });
      }

      // check to see that given event code matches database
      if (String(req.body["eventCode"]) != currentEvent[1]) {
        return res.json({ success: false, message: "Event code is invalid." });
      }
    }

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

// creates a new event in the database
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

// registers a new user in the database
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
    !("links" in req.body) ||
    !("photo" in req.body) ||
    !("biography" in req.body) ||
    !("skills" in req.body) ||
    !("interests" in req.body)
  ) {
    return res.json({
      success: false,
      message: "Invalid fields!",
    });
  }

  const release = await mutex.acquire();

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
        linkResume: req.body["links"]["Resume"],
        linkInstagram: req.body["links"]["Instagram"],
        linkLinkedin: req.body["links"]["Linkedin"],
        linkGithub: req.body["links"]["GitHub"],
        linkDropbox: req.body["links"]["DropBox"],
        linkMedium: req.body["links"]["Medium"],
        linkFacebook: req.body["links"]["Facebook"],
        linkTiktok: req.body["links"]["Tiktok"],
        photo: req.body["photo"],
        biography: req.body["biography"],
        skills: req.body["skills"],
        interests: req.body["interests"],
      })
      .set(req.body["phoneNumber"], newId)
      .exec();

    release();

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

// given a userId, returns a partial profile
app.post("/get-partial-profile", async (req, res) => {
  // ensure that all fields are present and spelled correctly
  if (!("userId" in req.body)) {
    return res.json({ success: false, message: "Invalid fields!" });
  }

  try {
    const partialProfile = await redisClient.hmGet(
      redisKeys.user(req.body["userId"]),
      [
        "photo",
        "fullName",
        "jobTitle",
        "company",
        "biography",
        "skills",
        "interests",
      ]
    );

    return res.json({
      success: true,
      message: "successfully retrieved partial user profile",
      partialProfile: {
        photo: partialProfile[0],
        fullName: partialProfile[1],
        jobTitle: partialProfile[2],
        company: partialProfile[3],
        biography: partialProfile[4],
        skills: partialProfile[5],
        interests: partialProfile[6],
      },
    });
  } catch (err) {
    console.log(err);

    return res.json({
      success: false,
      message: "there was an error while getting the users partial profile",
    });
  }
});

// given a userId, returns a full profile
app.post("/get-profile", async (req, res) => {
  // ensure that all fields are present and spelled correctly
  if (!("userId" in req.body)) {
    return res.json({ success: false, message: "Invalid fields!" });
  }

  try {
    const profile = await redisClient.hGetAll(
      redisKeys.user(req.body["userId"])
    );

    return res.json({
      success: true,
      message: "successfully retrieved user profile",
      userProfile: profile,
    });
  } catch (err) {
    console.log(err);

    return res.json({
      success: false,
      message: "there was an error while getting the users profile",
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
