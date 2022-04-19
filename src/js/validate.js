import express from 'express';
import { validationResult } from 'express-validator';
import { BadRequestError } from './httpError';

// parallel processing
const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    // next({ errors: errors.array() });
    next(new BadRequestError({ errors: errors.array() }));
  };
};

export default validate;
