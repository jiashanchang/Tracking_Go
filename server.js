const express = require("express");
const path = require("path");
const exphbs = require("express-handlebars");
const dotenv = require("dotenv");

dotenv.config({ path: ".env" });

require("./config/mongoose");

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.engine(
    ".hbs",
    exphbs.engine({
      extname: ".hbs",
      defaultLayout: "main",
    })
  );

app.set("view engine", "hbs");

app.use(express.static(path.join(__dirname, "public")));

const indexRouter = require("./routes/member");
const propertyRouter = require("./routes/property");
const membercenterRouter = require("./routes/membercenter");
const financialAnalysisRouter = require("./routes/financialanalysis");
const financialstatementRouter = require("./routes/financialstatement");

app.use("/", indexRouter);
app.use("/property", propertyRouter);
app.use("/membercenter", membercenterRouter);
app.use("/financialanalysis", financialAnalysisRouter);
app.use("/financialstatement", financialstatementRouter);

app.use((req, res) => {
  res.render("errorpage");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running in ${PORT}`));