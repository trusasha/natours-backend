const mongoose = require("mongoose");
const fs = require("fs");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

const Tour = require("../models/tour");

console.log("PROCESS: ", process.argv);

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD,
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("DB connected successful"));

// READ JSON FILE
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../../dev-data/data/tours.json`, "utf-8"),
);

// IMPORT DATA INTO DB
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log("Data successfully loaded");
  } catch (error) {
    console.error(error);
  }

  process.exit();
};

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log("Data successfully deleted");
  } catch (error) {
    console.error(error);
  }

  process.exit();
};

if (process.argv.includes("--delete")) {
  deleteData();
} else if (process.argv.includes("--import")) {
  importData();
}
