# AI CRM HCP Module – Log Interaction Screen

## 🚀 Overview
This project is an AI-first CRM system designed for logging Healthcare Professional (HCP) interactions.

Users can log interactions in two ways:
1. Manual form entry
2. AI-powered conversational input

---

## 🧠 Tech Stack
- Frontend: React
- Backend: FastAPI (Python)
- AI Agent: LangGraph
- LLM: Groq (llama-3.1-8b-instant)
- Database: (In-memory for demo)

---

## 🤖 AI Agent (LangGraph)

The agent processes user input and performs structured extraction.

### Tools:
1. Log Interaction Tool – Extracts structured data from chat
2. Edit Interaction Tool – Updates interaction data
3. Fetch History Tool – Retrieves past interactions
4. Sentiment Analysis Tool – Detects sentiment
5. Follow-up Tool – Suggests next actions

---

## ⚠️ Note
The originally specified model (gemma2-9b-it) is deprecated.  
So, llama-3.1-8b-instant is used instead.

---

## 🎯 Features
- Dual input system (Form + Chat)
- AI-powered extraction
- Structured JSON output
- Clean UI layout

---

## ▶️ How to Run

### Backend
cd backend  
uvicorn main:app --reload  

### Frontend
cd frontend  
npm start  

---

## 📹 Demo
(Attach video link here)