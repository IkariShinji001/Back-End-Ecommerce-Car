const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Ecomerce Car API",
      description: "Documentation for Car API",
      version: "1.0.0",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
    ],
  },
  apis: ["./APIdocs/user.API.js"]
};

const specs = swaggerJsdoc(options);

module.exports = specs;