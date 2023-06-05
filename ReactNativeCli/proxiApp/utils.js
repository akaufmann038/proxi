export const getCodeHttp = 'http://localhost:3000/get-code';
export const verifyCodeHttp = 'http://localhost:3000/verify-code';
export const registerFullUserHttp = 'http://localhost:3000/register-full-user';
export const getFeedHttp = 'http://localhost:3000/get-feed';
export const registerUserHttp = 'http://localhost:3000/register-event';
export const getConnectionsAllHttp =
  'http://localhost:3000/get-connections-all';
export const queryHashDataHttp = 'http://localhost:3000/query-hash-data';

// id's of recommended skills and interests
export const recommendedSkills = [1, 2, 3, 4, 5];
export const recommendedInterests = [1, 2, 3, 4, 5];

// TODO: this is acting like a fake database for the skills and interests
// in the future, keep source of truth of skills and interests in database
export const skills = [
  {name: 'Excel', id: 1},
  {name: 'Valuation', id: 2},
  {name: 'Investments', id: 3},
  {name: 'User Experience', id: 4},
  {name: 'Project Management', id: 5},
  {name: 'Figma', id: 6},
  {name: 'Photoshop', id: 7},
  {name: 'Illustrator', id: 8},
  {name: 'UI/UX', id: 9},
  {name: 'Typography', id: 10},
  {name: 'Website Dev', id: 11},
  {name: 'HTML/CSS', id: 12},
  {name: 'React', id: 13},
  {name: 'Javascript', id: 14},
  {name: 'Adobe CC', id: 15},
];
export const interests = [
  {name: 'Lacrosse', id: 1},
  {name: 'Entrepreneurship', id: 2},
  {name: 'Cooking', id: 3},
  {name: 'Film Making', id: 4},
  {name: 'Design', id: 5},
  {name: 'Space Travel', id: 6},
  {name: 'Typography', id: 7},
  {name: 'Sustainability', id: 8},
  {name: 'Tennis', id: 9},
  {name: 'Writing', id: 10},
  {name: 'Aviation', id: 11},
  {name: 'Traveling', id: 12},
];

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

export const dates = {
  0: 'Jan',
  1: 'Feb',
  2: 'Mar',
  3: 'Apr',
  4: 'May',
  5: 'Jun',
  6: 'Jul',
  7: 'Aug',
  8: 'Sep',
  9: 'Oct',
  10: 'Nov',
  11: 'Dec',
};
