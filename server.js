import dotenv from "dotenv";
import { app } from "./app.js";
import { connectToDB } from "./src/configs/connectToDB.js";

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 8000;

connectToDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.log(`MongoDB Connection Failed!! ${error}`);
    process.exit(1); // Exit process with failure
  });
