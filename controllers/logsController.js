const express = require("express");
const logs = express.Router();
const logsArray = require("../models/log.js");
const { validateURL, validateDataType } = require("../models/validations.js");

logs.get("/", (req, res) => {
  let logsArrayCopy = [...logsArray];
  const { order, mistakes, lastCrisis } = req.query;

  if (order === "asc") {
    logsArrayCopy.sort((a, b) => (a.title > b.title ? 1 : -1));
  } else if (order === "desc") {
    logsArrayCopy.sort((a, b) => (a.title > b.title ? -1 : 1));
  }

  if (mistakes === "true") {
    logsArrayCopy = logsArrayCopy.filter(
      ({ mistakesWereMadeToday }) => mistakesWereMadeToday
    );
  } else if (mistakes === "false") {
    logsArrayCopy = logsArrayCopy.filter(
      ({ mistakesWereMadeToday }) => !mistakesWereMadeToday
    );
  }

  if (lastCrisis === "lte5") {
    logsArrayCopy = logsArrayCopy.filter(
      ({ daysSinceLastCrisis }) => daysSinceLastCrisis <= 5
    );
  } else if (lastCrisis === "gt10") {
    logsArrayCopy = logsArrayCopy.filter(
      ({ daysSinceLastCrisis }) => daysSinceLastCrisis > 10
    );
  } else if (lastCrisis === "gte20") {
    logsArrayCopy = logsArrayCopy.filter(
      ({ daysSinceLastCrisis }) => daysSinceLastCrisis >= 20
    );
  }

  res.json(logsArrayCopy);
});

logs.get("/NotFound", (req, res) => {
  res.send("<h1>The index you have inputted is Not Found!!</h1>");
});

logs.get("/:arrayIndex", (req, res) => {
  if (logsArray[req.params.arrayIndex]) {
    res.json(logsArray[req.params.arrayIndex]);
  } else {
    res.redirect("/logs/NotFound");
    res.status(404);
  }
});

logs.post("/", validateURL, validateDataType, (req, res) => {
  logsArray.push(req.body);
  res.json(logsArray[logsArray.length - 1]);
});

logs.delete("/:indexArray", (req, res) => {
  if (logsArray[req.params.indexArray]) {
    const deletedLog = logsArray.splice(req.params.indexArray, 1);
    res.status(200).json(deletedLog);
  } else {
    res.status(404).json({ error: "Not Found" });
  }
});

logs.put("/:arrayIndex", validateURL, validateDataType, async (req, res) => {
  if (logsArray[req.params.arrayIndex]) {
    logsArray[req.params.arrayIndex] = req.body;
    res.status(200).json(logsArray[req.params.arrayIndex]);
  } else {
    res.status(404).json({ error: "Not Found" });
  }
});

module.exports = logs;
