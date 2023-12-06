const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

const { PORT } = require("./src/constants");
const app = require("./app");

app.listen(PORT, "127.0.0.1", () => console.log(`App running on port ${PORT}`));
