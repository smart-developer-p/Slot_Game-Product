"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const swaggerJSDoc = require("swagger-jsdoc");
const PORT = process.env.PORT || 5000;
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Slot Game API",
            version: "1.0.0",
            description: "API documentation for my slot backend",
        },
        schemes: ["http"],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                },
            }
        },
        security: [
            {
                "bearerAuth": []
            }
        ],
        servers: [
            {
                url: `http://172.20.100.81:${PORT}/api`, // Adjust if necessary
            },
            {
                url: `http://localhost:${PORT}/api`
            }
        ],
    },
    apis: ["./src/routes/**/*.yaml"], // Update this path to match your folder structure
};
exports.default = swaggerJSDoc(options);
