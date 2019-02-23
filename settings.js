const mongoose = require('mongoose');
const HTTPStatus = {
  OK: 200,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  PARAMS_INVALID: 400
};
const Config = {
  name_minlength: 4,
  name_maxlength: 300,

};

module.exports.HTTPStatus = HTTPStatus;
module.exports.Config = Config;
