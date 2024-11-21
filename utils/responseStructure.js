const config = require("../db.config/db.config");
const { uid } = require("uid");

const successResponse = (responseMessage) => ({
  result: "Success",
  responseObj: {
    responseId: uid(16),
    responseTs: `${Math.floor(Date.now() / 1000)}`,
    responseApiVersion: config.appVersion,
    responseCode: 200,
    responseMessage: "successfully done",
    responseDataParams: {
      data: responseMessage,
    },
  },
});

const errorResponse = (errorMessage) => ({
  result: "Error",
  responseObj: {
    responseId: uid(16),
    responseTs: `${Math.floor(Date.now() / 1000)}`,
    responseApiVersion: config.appVersion,
    responseCode: 401,
    responseMessage: "Error in Process",
    responseDataParams: {
      data: errorMessage,
    },
  },
});

const warningResponse = (warningMessage) => ({
  result: "Warning",
  responseObj: {
    responseId: uid(16),
    responseTs: `${Math.floor(Date.now() / 1000)}`,
    responseApiVersion: config.appVersion,
    responseCode: 501,
    responseMessage: "Ran with Warnings",
    responseDataParams: {
      data: warningMessage,
    },
  },
});

module.exports = {
  successResponse,
  errorResponse,
  warningResponse,
};
