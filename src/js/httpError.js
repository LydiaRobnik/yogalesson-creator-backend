class BadRequestError extends Error {
  constructor(errorObj) {
    super(errorObj);
    this.name = 'BadRequestError';
    this.errorObj = errorObj;
    this.code = 400;
  }
}

class NotFoundError extends Error {
  constructor(errorObj = 'Not found') {
    super(errorObj);
    this.name = 'BadRequestError';
    this.errorObj = errorObj;
    this.code = 404;
  }
}

export { NotFoundError, BadRequestError };
