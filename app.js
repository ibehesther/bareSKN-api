const express = require("express");
const {graphqlHTTP} = require("express-graphql");
const mongoose = require("mongoose");
const cors = require("cors");
const schema = require('./schema/schema');
const { productsRouter } = require("./routes/products");
const { collectionsRouter } = require("./routes/collections");
const { categoriesRouter } = require("./routes/categories");
const { subCategoriesRouter } = require("./routes/subcategories");
const { cartRouter } = require("./routes/cart");
const { usersRouter } = require("./routes/user");
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;
const {DATABASE_USERNAME, 
    DATABASE_PASSWORD, 
    DATABASE_CLUSTER, 
    DATABASE_NAME,
    NODE_ENV,
    DATABASE_DEV_URL,
    DATABASE_TEST_URL
} = process.env;

let dbURL;

if (process.env.NODE_ENV ==='test'){
  dbURL = DATABASE_TEST_URL
}
else if (process.env.NODE_ENV ==='development'){
  dbURL = DATABASE_DEV_URL
}


// mongoose.connect(
//     `mongodb+srv://${DATABASE_USERNAME}:${DATABASE_PASSWORD}@${DATABASE_CLUSTER}.mongodb.net/${DATABASE_NAME}?retryWrites=true&w=majority`,
//   {
//     useNewUrlParser: true,
//     // useFindAndModify: false,
//     useUnifiedTopology: true
//   }
// );

mongoose.connect(
  dbURL,
{
  useNewUrlParser: true,
  useUnifiedTopology: true
}
);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});

app.use(cors({origin: '*'}))
// app.use(Router, graphqlHTTP({
//   schema
// }));
app.use(express.json())
app.use('/api/v1.0/products', productsRouter);
app.use('/api/v1.0/collections', collectionsRouter);
app.use('/api/v1.0/categories', categoriesRouter);
app.use('/api/v1.0/subcategories', subCategoriesRouter);
app.use('/api/v1.0/carts', cartRouter);
app.use('/api/v1.0/users', usersRouter);

// Error handling using middleware
app.use((error, req, res, next) => {
  switch(error.type){
    case "bad request":
      res.status(400).send({
        error: "Bad Request",
        statusCode: 400,
        message: "Request cannot be fulfilled due to bad syntax"
      })
      break;
    case "unauthorized":
      res.status(401).send({
        error: "Unauthorized",
        statusCode: 401,
        message: "User is not authorized to access resource(s)"
      })
      break;
    case "not found":
      res.status(404).send({
        error: "Not Found",
        statusCode: 404,
        message: "Resource not found"
      })
      break;  
    case "internal server error":
      res.status(500).send({
        error: "Internal Server Error",
        statusCode: 500,
        message: "Server could not process request"
      })
      break;
    default:
      console.log("Error not handled");
  }
  next();
})


app.get('/api/v1.0/', (req, res) => {
  res.send('Welcome to BareSKN API Version 1.0');
})

app.listen(PORT, console.log(`Server is running in port ${PORT}`));

module.exports = app;
