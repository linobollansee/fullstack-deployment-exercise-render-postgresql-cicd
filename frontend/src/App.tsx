import { useState, useEffect } from "react";
import "./App.css";

interface Quote {
  id: number;
  text: string;
  author: string;
  createdAt: string;
  updatedAt: string;
}

function App() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newQuote, setNewQuote] = useState({ text: "", author: "" });

  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/quotes");
      if (!response.ok) throw new Error("Failed to fetch quotes");
      const data = await response.json();
      setQuotes(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuote.text || !newQuote.author) return;

    try {
      const response = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newQuote),
      });
      if (!response.ok) throw new Error("Failed to create quote");
      setNewQuote({ text: "", author: "" });
      fetchQuotes();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create quote");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/quotes/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete quote");
      fetchQuotes();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete quote");
    }
  };

  if (loading) return <div className="container">Loading quotes...</div>;

  return (
    <div className="container">
      <h1>Quotes App</h1>

      {error && <div className="error">{error}</div>}

      <form onSubmit={handleSubmit} className="quote-form">
        <h2>Add New Quote</h2>
        <input
          type="text"
          placeholder="Quote text"
          value={newQuote.text}
          onChange={(e) => setNewQuote({ ...newQuote, text: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Author"
          value={newQuote.author}
          onChange={(e) => setNewQuote({ ...newQuote, author: e.target.value })}
          required
        />
        <button type="submit">Add Quote</button>
      </form>

      <div className="quotes-list">
        <h2>All Quotes ({quotes.length})</h2>
        {quotes.map((quote) => (
          <div key={quote.id} className="quote-card">
            <p className="quote-text">"{quote.text}"</p>
            <p className="quote-author">— {quote.author}</p>
            <button
              onClick={() => handleDelete(quote.id)}
              className="delete-btn"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
