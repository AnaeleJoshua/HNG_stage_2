const router = require("express").Router();

// Controller Imports
const AuthorizationController = require("./authController");

// Middleware Imports
const SchemaValidationMiddleware = require("../middlewares/SchemaValidationMiddleware");

// // JSON Schema Imports for payload verification
const registerPayload = require("../schemas/registerPayload");
const loginPayload = require("../schemas/loginPayload");

router.post(
    "/register",
    [SchemaValidationMiddleware.verify(registerPayload)],
    AuthorizationController.register
  );

  // [SchemaValidationMiddleware.verify(loginPayload)]
  router.post(
    "/login",[SchemaValidationMiddleware.verify(loginPayload)],
    AuthorizationController.login
  );

module.exports = router