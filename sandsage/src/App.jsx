import { useState } from "react";

function App() {
  const [emotion, setEmotion] = useState("");
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const LoadingSpinner = () => (
    <div className="flex items-center justify-center space-x-2 mt-6">
      <div className="w-3 h-3 rounded-full animate-ping bg-yellow-600"></div>
      <div className="w-3 h-3 rounded-full animate-ping bg-yellow-700 delay-150"></div>
      <div className="w-3 h-3 rounded-full animate-ping bg-yellow-800 delay-300"></div>
    </div>
  );

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
          model: "llama3-8b-8192",
          messages: [
            { role: "system", content: "You are a wise sage from the desert." },
            { role: "user", content: prompt },
          ],
        }),
      });

      const text = await res.text();
      console.log("📃 Raw response text:", text);

      let data;
      try {
        data = JSON.parse(text);
      } catch (err) {
        throw new Error("Invalid JSON response from backend");
      }

      if (!res.ok || !data.choices || !data.choices[0]?.message?.content) {
        console.error("⚠️ Invalid backend response:", data);
        throw new Error("Invalid response from backend");
      }

      setResponse(data.choices[0].message.content);
    } catch (err) {
      console.error("❌ Error:", err.message);
      setResponse("⚠️ The winds were silent. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-amber-100 via-yellow-200 to-orange-200 text-center font-serif">
      <h1 className="text-4xl font-bold mb-2 tracking-wide text-yellow-800">🌾 SandSage</h1>
      <p className="mb-6 text-yellow-700 italic">
        Whisper your feelings to the desert... and receive ancient wisdom 🌬️
      </p>

      <input
        type="text"
        placeholder="What emotion fills your heart?"
        className="border border-yellow-500 bg-white/90 p-2 rounded mb-3 w-full max-w-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
        value={emotion}
        onChange={(e) => setEmotion(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
      />
      <input
        type="text"
        placeholder="Ask the sands a deep question..."
        className="border border-yellow-500 bg-white/90 p-2 rounded mb-3 w-full max-w-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
      />

      <button
        className="bg-yellow-600 hover:bg-yellow-700 text-white px-5 py-2 rounded shadow-lg transition duration-200 disabled:opacity-50"
        onClick={handleGenerate}
        disabled={loading}
      >
        {loading ? "Summoning Wisdom..." : "Ask the Sand"}
      </button>

      {loading && <LoadingSpinner />}

      {response && (
        <div className="mt-6 p-5 border-2 border-yellow-600 bg-white/80 rounded-lg shadow-xl max-w-2xl text-gray-800 italic whitespace-pre-wrap overflow-y-auto max-h-[400px]">
          {response}
        </div>
      )}
    </div>
  );
}

export default App;
