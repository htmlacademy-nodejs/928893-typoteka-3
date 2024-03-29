'use strict';

const ExitCode = {
  success: 0,
  error: 1,
};

const HttpCode = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

const MAX_ID_LENGTH = 6;

module.exports = {ExitCode, HttpCode, MAX_ID_LENGTH};
