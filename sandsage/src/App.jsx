import { useState } from "react";

function App() {
  const [emotion, setEmotion] = useState("");
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setResponse("");

    const prompt = `Imagine you're an ancient sage writing in the sand. Respond poetically to this feeling: "${emotion}" and this question: "${question}".`;

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "mistral/mistral-7b-instruct",
          messages: [
            { role: "system", content: "You are a wise sage from the desert." },
            { role: "user", content: prompt },
          ],
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.choices || !data.choices[0]?.message?.content) {
        console.error("⚠️ Invalid backend response:", data);
        throw new Error("Invalid response from backend");
      }

      setResponse(data.choices[0].message.content);
    } catch (err) {
      console.error("❌ Error:", err.message);
      setResponse("⚠️ Failed to fetch wisdom from the sands. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-yellow-100 to-orange-100 text-center">
      <h1 className="text-3xl font-bold mb-4">🌾 SandSage</h1>
      <p className="mb-6 text-gray-700">Get poetic wisdom written in the sands of AI 🌬️</p>

      <input
        type="text"
        placeholder="How are you feeling?"
        className="border p-2 rounded mb-3 w-full max-w-md"
        value={emotion}
        onChange={(e) => setEmotion(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
      />
      <input
        type="text"
        placeholder="Ask a deep question..."
        className="border p-2 rounded mb-3 w-full max-w-md"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
      />
      <button
        className="bg-orange-400 text-white px-4 py-2 rounded hover:bg-orange-500"
        onClick={handleGenerate}
        disabled={loading}
      >
        {loading ? "Summoning Wisdom..." : "Reveal the Sand's Message"}
      </button>

      {response && (
        <div className="mt-6 p-4 border bg-white rounded shadow max-w-xl text-gray-800 italic whitespace-pre-wrap">
          {response}
        </div>
      )}
    </div>
  );
}

export default App;
