const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const CustomError = require('./utils/CustomError');
const globalErrorHandler = require('./controllers/error.controllers')
const cors = require('cors');

let app = express();

app.use(express.json());
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(cors());
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(bodyParser.json({ limit: "50mb" }));

// app.use("/resumes",express.static("./public/uploads/resumes"));

// Routes
app.use("/api/v1/servicerequest", require("./routes/servicerequest.routes"));
app.use("/api/v1/businessenquiry", require("./routes/businessenquiry.routes"));
app.use("/api/v1/career", require("./routes/career.routes"));

app.all("*", (req, res, next) => {
    const error = new CustomError(`I'm unable to locate the ${req.originalUrl} endpoint on the server.`, 404)
    next(error);
});

app.use(globalErrorHandler);

module.exports = app;