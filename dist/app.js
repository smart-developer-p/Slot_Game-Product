"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express = require("express");
const games_1 = require("./routes/games");
const mongoose_1 = require("mongoose");
const swaggerUi = require("swagger-ui-express");
const swaggerConfig_1 = require("./swaggerConfig"); // Adjust path as needed
const authRoutes_1 = require("./routes/authRoutes");
const cors = require("cors");
const config = require("../config");
const PORT = process.env.PORT || 5000;
const mongodbUri = process.env.mongodbUri || "mongodb://0.0.0.0:27017/slots";
const app = express();
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerConfig_1.default));
app.use(express.static(`${config.DIR}/public/`));
app.use(cors({
    origin: "*"
}));
app.use('/api/games', games_1.default);
app.use('/api/auth', authRoutes_1.default);
mongoose_1.default.connect(mongodbUri).then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}).catch((err) => {
    console.log(err);
});
