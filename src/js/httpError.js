class HttpError extends Error {
  constructor(
    errorObj = 'http error',
    code = 500,
    name = 'InternalServerError'
  ) {
    super(errorObj);
    this.name = name;
    this.errorObj = errorObj;
    this.code = code;
  }
}
class BadRequestError extends HttpError {
  constructor(errorObj) {
    super(errorObj, 400, 'BadRequestError');
  }
}

class NotFoundError extends HttpError {
  constructor(errorObj = 'Not found') {
    super(errorObj, 404, 'NotFoundError');
  }
}

export { NotFoundError, BadRequestError, HttpError };
