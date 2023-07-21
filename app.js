import express from "express";
import morgan from "morgan";
const app = express();
import mongoose from "mongoose";

import productRoutes from "./api/routes/products.js";
import orderRoutes from "./api/routes/order.js";

mongoose.connect(
  "mongodb+srv://root:" +
    process.env.MONGO_ATLAS_PW +
    "@cluster0.iw3wajn.mongodb.net/?retryWrites=true&w=majority",

  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data
app.use(express.json()); //Parse JSON data in the req. body

/* app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
   res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-WIth ,Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-COntrol-Allow-Methods", "PUT, POST ,PATCH ,DELETE ,GET");
    return res.status(200).json({});
  }
}); */

//Routes handling request
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

export default app;
