// just for testing async await and fetch requests

const fetch = require("node-fetch");
const fs = require("fs");

/*
setTimeout(() => {
  console.log("Waited 1 second");
}, 1000);

fs.readFile("./test2.txt", { encoding: "utf-8" }, (err, data) => {
  if (err) {
    console.error("Error");
    console.error(err);
  } else {
    console.error("Got data");
    console.log(data);
  }
});
*/

/*
fetch("https://pokeapi.co/api/v2/pokemon/ditto")
  .then((res) => res.json())
  .then((data) => console.log(data))
  .catch((err) => console.log(err));
  */

/*
curl -X POST http://localhost:3000/text-verification -H "Content-Type: application/json" -d '{"phoneNumber": 777}'
 */
//-----------------------------------

const fetchPokemon = async () => {
  try {
    const res = await fetch("https://pokeapi.co/api/v2/pokemon/ditto");
    const data = await res.json();
    console.log(data.abilities);
  } catch (err) {
    console.log(err);
  }
};
//fetchPokemon();

const textVerification = async () => {
  try {
    const res = await fetch("http://localhost:3000/get-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phoneNumber: 7812010366,
      }),
    });
    const data = await res.json();

    console.log(data);
    console.log(res.status);
  } catch (err) {
    console.log(err);
  }
};
//textVerification();

const verify = async () => {
  try {
    const res = await fetch("http://localhost:3000/generate-message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        profileData: "hi",
      }),
    });
    const data = await res.json();

    console.log(data);
  } catch (err) {
    console.log(err);
  }
};

const handlePhoneNumberChange = (text) => {
  let cleaned = ("" + text).replace(/\D/g, "");
  if (cleaned === "") {
    setPhoneNumber("");
    setIsValidPhoneNumber(false);
    return;
  }
  let match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4}).*/);
  let number = [
    "(",
    match[1] || "",
    match[2] ? ") " : "",
    match[2],
    match[3] ? "-" : "",
    match[3],
  ].join("");

  console.log(number);
};

const validatePhoneNumber = (phoneNumber) => {
  let phoneRegex = /^[2-9]{2}[0-9]{8}$/; // sample phone number validation
  return phoneRegex.test(phoneNumber);
};

function resolveAfter2Seconds(x) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(x);
    }, 2000);
  });
}

async function f1() {
  const x = await resolveAfter2Seconds(10);
  console.log(x); // 10
}

f1();
