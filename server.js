import { app } from "./app.js";
import dotenv from "dotenv";
import { connectDB } from './src/config/db.js';

dotenv.config();
const Port = process.env.PORT || 5000;

await connectDB();

app.listen(Port, () => {
    console.log(`Server is listening at port ${Port}`);
});
