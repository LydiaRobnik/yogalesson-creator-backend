// express middleware logRequest.js

export default async (req, res, next) => {
  const { method, url, body, params, query } = req;

  console.info(`request data`, { method, url, body, params, query });
  next();
};
