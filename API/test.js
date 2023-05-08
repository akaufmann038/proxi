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
const myPromise = new Promise((resolve, reject) => {
  const rand = Math.floor(Math.random() * 2);
  if (rand == 0) {
    resolve();
  } else {
    reject();
  }
})
  .then(() => console.log("Success"))
  .catch(() => console.error("Something went wrong"));

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
    const res = await fetch("http://localhost:3000/verify-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phoneNumber: 7812010366,
        verificationCode: 7421,
      }),
    });
    const data = await res.json();

    console.log(data);
  } catch (err) {
    console.log(err);
  }
};
verify();
