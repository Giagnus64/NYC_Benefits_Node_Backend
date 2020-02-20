"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const app = express();
const api = require("./api.js");
const port = process.env.PORT || 3000;
app.use(express.json());
app.use("/api", api);
app.get("/", (req, res) => {
    res.redirect(300, "/api");
});
app.listen(port, () => console.log(`Listening on ${port}`));
//# sourceMappingURL=app.js.map