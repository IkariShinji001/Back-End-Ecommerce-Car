const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerDocs = require("./APIdocs/swaggerConfig");
app.use(cors());

// Routes
const userRoute = require("./Routes/user.route");
const carRoute = require("./Routes/car.route");
const authRoute = require("./Routes/auth.route");
const salesRoute = require("./Routes/sale.route");
const brandRoute = require("./Routes/brand.route");


dotenv.config();
mongoose.connect('mongodb://127.0.0.1:27017/OtoDB')
    .then(() => {
        console.log("DB connected");
    })
    .catch(err => {
        console.log(err);
    })


// Middleware
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use(express.urlencoded({ extended: true }))
app.use(express.json());


// Define route
app.use(process.env.BASE_API, userRoute);
app.use(process.env.BASE_API, carRoute);
app.use(process.env.BASE_API, authRoute);
app.use(process.env.BASE_API, salesRoute);
app.use(process.env.BASE_API, brandRoute);
 

app.listen(process.env.PORT, () =>{
    console.log("Server is running on port " + process.env.PORT);
}) 