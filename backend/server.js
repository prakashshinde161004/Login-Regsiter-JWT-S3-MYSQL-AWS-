import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

// Serve static assets (React frontend)
const publicDir = path.join(__dirname, "public");
const frontendDist = path.join(__dirname, "../frontend/dist");
const staticDir = fs.existsSync(publicDir) ? publicDir : (fs.existsSync(frontendDist) ? frontendDist : null);

if (staticDir) {
  app.use(express.static(staticDir));
  app.get("*", (req, res) => {
    res.sendFile(path.join(staticDir, "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("Login API is running");
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
