export const getCodeHttp = 'http://localhost:3000/get-code';
export const verifyCodeHttp = 'http://localhost:3000/verify-code';

// TODO: this is acting like a fake database for the skills and interests
// in the future, keep source of truth of skills and interests in database
export const skills = [
  'Excel',
  'Valuation',
  'Investments',
  'User Experience',
  'Project Management',
  'Figma',
  'Photoshop',
  'Illustrator',
  'UI/UX',
  'Typography',
  'Website Dev',
  'HTML/CSS',
  'React',
  'Javascript',
  'Adobe CC',
];
export const interests = [
  'Lacrosse',
  'Entrepreneurship',
  'Cooking',
  'Film Making',
  'Design',
  'Space Travel',
  'Typography',
  'Sustainability',
  'Tennis',
  'Writing',
  'Aviation',
  'Traveling',
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
