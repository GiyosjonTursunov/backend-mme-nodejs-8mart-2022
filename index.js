const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const PORT = process.env.PORT || 8000;

const authRouter = require("./routes/authRouter");
const managerRouter = require("./routes/managerRouter");
const vendorRouter = require("./routes/vendorRouter");
const directorRouter = require("./routes/directorRouter");
const supplierRouter = require("./routes/supplierRouter");
const wareHouseRouter = require("./routes/wareHouseRouter");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "25MB" }));

app.use("/auth", authRouter);
app.use("/director", directorRouter);
app.use("/manager", managerRouter);
app.use("/vendor", vendorRouter);
app.use("/supplier", supplierRouter);
app.use("/wareHouse", wareHouseRouter);

app.listen(PORT, () => console.log(`server started on port ${PORT}`));
