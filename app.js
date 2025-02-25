const express = require("express");
const cors = require("cors");
const notFound = require("./middlewares/notFound");
const handleErrors = require("./middlewares/handleErrors");
const moviesRouter = require("./routers/moviesRouter");

const app = express();
const { PORT, FE_URL } = process.env;

app.use(express.static("public"));

app.use(express.json());

app.use(
  cors({
    origin: FE_URL,
  })
);

app.use("/movies", moviesRouter);

app.use(notFound);
app.use(handleErrors);

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
