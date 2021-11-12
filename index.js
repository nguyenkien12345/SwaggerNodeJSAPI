const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const low = require("lowdb");
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
// Router
const booksRouter = require("./routes/books");
// Port
const PORT = process.env.PORT || 5000;

const FileSync = require("lowdb/adapters/FileSync");
const adapter = new FileSync("db.json"); // Tạo ra file database.json
const db = low(adapter);

db.defaults({ books: [] }).write; // set default 1 mảng books rỗng

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Library Api",
      version: "1.0.0",
      description: "A simple Express Library Api",
    },
    servers: [
      {
        url: "http://localhost:5000",
      },
    ],
  },
  apis: ["./routes/*.js"], 
};

const specs = swaggerJsDoc(options);

const app = express();

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

app.db = db; // Các route có thể truy cập tham chiếu đến

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/books", booksRouter);

app.listen(PORT, () => console.log(`The Server Is Running On Port ${PORT}`));

// Gõ http://localhost:5000//api-docs sẽ hiển thị ra swagger api