const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const CustomError = require("./utils/CustomError");
const globalErrorHandler = require("./controllers/error.controllers");
const cors = require("cors");
const passport = require("passport");
const helmet = require("helmet");
const { rateLimit } = require("express-rate-limit");
const { xss } = require("express-xss-sanitizer");
const hpp = require("hpp");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: async (_, res) => {
    return res.status(429).json({
      status: 429,
      success: true,
      message:
        "You have made too many requests. Please try again after 15 minutes.",
    });
  },
});

let app = express();

app.use(
  cors({
    origin:
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000"
        : "http://cablecare.co",
  })
);

app.use(express.json());
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(passport.initialize());
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
app.use(bodyParser.json({ limit: "10mb" }));
app.use(hpp());
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);
if (process.env.NODE_ENV !== "development") {
  app.use(limiter);
}
app.use(xss());
//? app.use("/resumes",express.static("./public/uploads/resumes"));
app.use("/images", express.static("./public/uploads/images"));
// Routes
app.use("/api/v1/servicerequest", require("./routes/servicerequest.routes"));
app.use("/api/v1/businessenquiry", require("./routes/businessenquiry.routes"));
app.use("/api/v1/career", require("./routes/career.routes"));
app.use("/api/v1/auth", require("./routes/auth.routes"));
app.use("/api/v1/job", require("./routes/job.routes"));
app.use("/api/v1/pageimages", require("./routes/pageimages.routes"));

app.all("*", (req, res, next) => {
  const error = new CustomError(
    `I'm unable to locate the ${req.originalUrl} endpoint on the server.`,
    404
  );
  next(error);
});

app.use(globalErrorHandler);

module.exports = app;
