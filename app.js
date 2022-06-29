if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const cors = require("cors");
const express = require("express");
const newsRouter = require("./routes/newsRoutes");
const categoryRouter = require("./routes/categoryRoutes");
const historyRouter = require("./routes/historyRoute");
const likesRouter = require("./routes/likesRouter");
const authController = require("./controllers/authController");
const errorHandler = require("./middlewares/handleError");
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  // res.send('Rest API News Portal by Muhammad Ihsan Erdiansyah')

  res.status(200).json({
    messeage: "Rest API News Portal by Muhammad Ihsan Erdiansyah",
  });
});

app.post("/register", authController.authRegis);
app.post("/customers/register", authController.authCustRegis);

app.post("/login", authController.authLogin);
app.post("/customers/login", authController.authCustLogin);

app.post("/authGoogle", authController.authGoogle);
app.post("/customers/authGoogle", authController.authCustGoogle);

app.use("/news", newsRouter);

app.use("/category", categoryRouter);

app.use("/history", historyRouter);

app.use("/favorite", likesRouter);

app.use(errorHandler);

module.exports = app;

app.listen(port, () => {
  console.log("this app is running at port: ", port);
});
