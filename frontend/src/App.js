import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [input, setInput] = useState("");

  const [form, setForm] = useState({
    hcp_name: "",
    interaction_type: "Meeting",
    date: "",
    time: "",
    attendees: "",
    topics: "",
    sentiment: "Neutral",
    outcomes: "",
    followup: ""
  });

  const [loading, setLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState(null);

  // ✅ AUTO FILL DATE & TIME ON LOAD
  useEffect(() => {
    const now = new Date();

    setForm((prev) => ({
      ...prev,
      date: now.toISOString().split("T")[0],
      time: now.toTimeString().slice(0, 5)
    }));
  }, []);

  // ✅ AI CALL
  const handleAI = async () => {
    try {
      setLoading(true);

      const res = await fetch("http://127.0.0.1:8000/ai-log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input })
      });

      const data = await res.json();

      const now = new Date();

      // ✅ Autofill
      setForm((prev) => ({
        ...prev,
        hcp_name: data.interaction?.hcp_name || "",
        interaction_type:
          data.interaction?.interaction_type || "Meeting",
        topics: data.summary || "",
        sentiment: data.sentiment || "Neutral",
        followup: data.followup || "",
        date: now.toISOString().split("T")[0],
        time: now.toTimeString().slice(0, 5)
      }));

      setAiResponse(data);
    } catch (err) {
      console.error(err);
      alert("Backend error");
    } finally {
      setLoading(false);
    }
  };

  // ✅ SAVE
  const handleSave = async () => {
    try {
      await fetch("http://127.0.0.1:8000/log-interaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hcp_name: form.hcp_name,
          interaction_type: form.interaction_type,
          summary: form.topics,
          sentiment: form.sentiment
        })
      });

      alert("Saved to DB ✅");
    } catch (err) {
      alert("Save failed ❌");
    }
  };

  return (
    <div className="page">
      <h2 className="title">Log HCP Interaction</h2>

      <div className="layout">
        {/* LEFT PANEL */}
        <div className="left">
          <div className="card">
            <div className="card-header">Interaction Details</div>

            <div className="card-body">
              <div className="form-grid">
                <div className="form-field">
                  <label>HCP Name</label>
                  <input
                    placeholder="Search or select HCP..."
                    value={form.hcp_name}
                    onChange={(e) =>
                      setForm({ ...form, hcp_name: e.target.value })
                    }
                  />
                </div>

                <div className="form-field">
                  <label>Interaction Type</label>
                  <select
                    value={form.interaction_type}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        interaction_type: e.target.value
                      })
                    }
                  >
                    <option>Meeting</option>
                    <option>Call</option>
                    <option>Email</option>
                  </select>
                </div>

                <div className="form-field">
                  <label>Date</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) =>
                      setForm({ ...form, date: e.target.value })
                    }
                  />
                </div>

                <div className="form-field">
                  <label>Time</label>
                  <input
                    type="time"
                    value={form.time}
                    onChange={(e) =>
                      setForm({ ...form, time: e.target.value })
                    }
                  />
                </div>

                <div className="form-field full-width">
                  <label>Attendees</label>
                  <input
                    placeholder="Enter names or search..."
                    value={form.attendees}
                    onChange={(e) =>
                      setForm({ ...form, attendees: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* TOPICS */}
              <div className="form-field full-width">
                <label>Topics Discussed</label>
                <textarea
                  placeholder="Enter key discussion points..."
                  value={form.topics}
                  onChange={(e) =>
                    setForm({ ...form, topics: e.target.value })
                  }
                />
              </div>

              <button className="voice-btn">
                ✦ Summarize from Voice Note (Requires Consent)
              </button>
            </div>
          </div>

          {/* MATERIALS */}
          <div className="card">
            <div className="card-body">
              <h4>Materials Shared / Samples Distributed</h4>

              <div className="material-box">
                <div>
                  <p>Materials Shared</p>
                  <small>No materials added.</small>
                </div>
                <button className="outline-btn">Search/Add</button>
              </div>

              <div className="material-box">
                <div>
                  <p>Samples Distributed</p>
                  <small>No samples added.</small>
                </div>
                <button className="outline-btn">Add Sample</button>
              </div>
            </div>
          </div>

          {/* SENTIMENT */}
          <div className="card">
            <div className="card-body">
              <h4 className="section-title">
                Observed/Inferred HCP Sentiment
              </h4>

              <div className="radio-group">
                {["Positive", "Neutral", "Negative"].map((s) => (
                  <label className="radio-item" key={s}>
                    <input
                      type="radio"
                      checked={form.sentiment === s}
                      onChange={() =>
                        setForm({ ...form, sentiment: s })
                      }
                    />
                    <span>{s}</span>
                  </label>
                ))}
              </div>

              <div className="form-field full-width">
                <label>Outcomes</label>
                <textarea
                  placeholder="Key outcomes or agreements..."
                  value={form.outcomes}
                  onChange={(e) =>
                    setForm({ ...form, outcomes: e.target.value })
                  }
                />
              </div>

              <div className="form-field full-width">
                <label>Follow-up Actions</label>
                <textarea
                  placeholder="Enter next steps or tasks..."
                  value={form.followup}
                  onChange={(e) =>
                    setForm({ ...form, followup: e.target.value })
                  }
                />
              </div>

              {/* AI FOLLOWUP */}
              {form.followup && (
                <div className="followup-box">
                  <p className="followup-title">
                    AI Suggested Follow-ups:
                  </p>
                  <div className="followup-content">
                    {form.followup}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="right">
          <div className="ai-header">
            <h3>🤖 AI Assistant</h3>
            <p>Log interaction via chat</p>
          </div>

          <div className="ai-body">
            <textarea
              placeholder="Log interaction details here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />

            {loading && <p>Loading AI...</p>}

            {aiResponse && (
              <div className="ai-result">
                <p><b>HCP:</b> {aiResponse.interaction?.hcp_name}</p>
                <p><b>Type:</b> {aiResponse.interaction?.interaction_type}</p>
                <p><b>Summary:</b> {aiResponse.summary}</p>
                <p><b>Sentiment:</b> {aiResponse.sentiment}</p>
                <p><b>Follow-up:</b> {aiResponse.followup}</p>
                <p><b>Recommendation:</b> {aiResponse.recommendation}</p>
              </div>
            )}
          </div>

          <div className="ai-footer">
            <button onClick={handleAI} disabled={loading}>
              {loading ? "Processing..." : "Log"}
            </button>

            <button onClick={handleSave} className="save-btn">
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;