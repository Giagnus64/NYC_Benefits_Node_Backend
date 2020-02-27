import { Request, Response } from "express";

const express = require("express");
const app = express();
const api = require("./api.js");
const port = process.env.PORT || 3000;

app.use(express.json());
app.use("/api", api);

app.get("/", (req: Request, res: Response ) => {
  res.redirect(300, "/api");
});

app.listen(port, () => console.log(`Listening on ${port}`));


