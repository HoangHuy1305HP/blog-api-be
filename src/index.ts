import dotenv from "dotenv";
import app from "./app.js";
import logger from "./utils/logger.js";

dotenv.config(); // đọc file JWT_SECRET =.../ PORT = ... -> nạp vào các process.env.JWT_SECRET, process.env.PORT,..

const PORT = Number(process.env.PORT || 3000);

app.listen(PORT, "0.0.0.0", () => {
    logger.info(`Server running on port http://localhost:${PORT}`);
});