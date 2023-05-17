export const getCodeHttp = 'http://localhost:3000/get-code';
export const verifyCodeHttp = 'http://localhost:3000/verify-code';

// A method for making requests to the api
// all the endpoints have a similar structure so you
// can just pass in the endpoints and the body of the request
export const makePostRequest = async (endpoint, body) => {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(body),
  });

  return res;
};
