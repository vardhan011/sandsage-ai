// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

// 🛡️ Sanity check for API key
if (!OPENROUTER_API_KEY) {
    console.error("❌ Missing OPENROUTER_API_KEY in .env");
    process.exit(1);
}

app.post("/generate", async (req, res) => {
    try {
        console.log("🔁 Request Body:", req.body);

        const openrouterRes = await fetch("https://api.openrouter.ai/v1/chat/completions", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(req.body),
        });

        const data = await openrouterRes.json();
        console.log("📦 OpenRouter Response:", data);

        if (!openrouterRes.ok || !data.choices) {
            return res.status(500).json({
                error: "OpenRouter returned error",
                details: data.error?.message || data,
            });
        }

        res.json(data);
    } catch (err) {
        console.error("🔥 Server error:", err);
        res.status(500).json({ error: "Internal Server Error", message: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server listening at http://localhost:${PORT}`);
});
