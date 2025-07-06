import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;
const GROQ_API_KEY = process.env.GROQ_API_KEY;

if (!GROQ_API_KEY) {
    console.error("❌ Missing GROQ_API_KEY in .env");
    process.exit(1);
}

app.post("/generate", async (req, res) => {
    try {
        const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${GROQ_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "llama3-8b-8192",
                messages: req.body.messages,
            }),
        });

        const data = await groqRes.json();
        console.log("📦 Groq Response:", data);

        if (!data.choices || !data.choices[0]?.message?.content) {
            return res.status(500).json({ error: "Groq response invalid", data });
        }

        res.json(data);
    } catch (err) {
        console.error("🔥 Server error:", err);
        res.status(500).json({ error: "Internal Server Error", message: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
