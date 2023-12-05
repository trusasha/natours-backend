const FILE_PATHS = {
  tours: `${__dirname}/../../dev-data/data/tours-simple.json`,
};
const PORT = 3000;
const API_VERSION = 1;
const ROUTS = {
  route: `/api/v${API_VERSION}`,
  tours: `/api/v${API_VERSION}/tours`,
  tour: `/api/v${API_VERSION}/tours/:id`,
  users: `/api/v${API_VERSION}/users`,
  user: `/api/v${API_VERSION}/users/:id`,
};

module.exports = {FILE_PATHS, PORT, API_VERSION, ROUTS};
