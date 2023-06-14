const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Ecommerce-Car API",
      description: "Documentation for Ecommerce-Car API",
      version: "1.0.0",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["./APIdocs/user.API.js",
        "./APIdocs/car.API.js"
        ]
};

const specs = swaggerJsdoc(options);

module.exports = specs;