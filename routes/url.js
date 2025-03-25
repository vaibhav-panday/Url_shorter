const express = require("express");
const {handleGenerateNewShortURL, handleGetAnalytics} = require("../controllers/url");
const route = express.Router();

route.post("/", handleGenerateNewShortURL);

route.get("/ana/:shortId",handleGetAnalytics);

module.exports = route;