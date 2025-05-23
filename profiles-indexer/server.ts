import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import profilesRouter from "./routes/profiles.routes.js"; // Added .js extension
import messagesRouter from "./routes/messages.routes.js";
import { notFoundHandler, errorHandler } from "./middleware/error.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/profiles", profilesRouter);
app.use("/messages", messagesRouter);

// Error handling middleware should be last
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
