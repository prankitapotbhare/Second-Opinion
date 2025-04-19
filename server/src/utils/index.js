/**
 * Export all utilities
 */
const errorUtil = require('./error.util');
const loggerUtil = require('./logger.util');
const responseUtil = require('./response.util');
const tokenUtil = require('./token.util');
const validationUtil = require('./validation.util');
const emailTemplatesUtil = require('./email-templates.util');

module.exports = {
  error: errorUtil,
  logger: loggerUtil,
  response: responseUtil,
  token: tokenUtil,
  validation: validationUtil,
  emailTemplates: emailTemplatesUtil
};