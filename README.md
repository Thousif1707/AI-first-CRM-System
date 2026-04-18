# AI-First CRM HCP Module – Log Interaction System

## Overview

This project is an AI-powered Customer Relationship Management (CRM) system designed for logging interactions with Healthcare Professionals (HCPs).

It allows users to log interactions using:
- A structured form
- A conversational AI assistant

The system converts unstructured natural language into structured CRM data using AI.

---

## Key Features

- Log interactions with doctors (HCPs)
- AI-powered interaction logging using natural language
- Automatic extraction of:
  - HCP Name
  - Interaction Type
  - Summary
  - Sentiment
- AI-generated follow-up suggestions
- Multi-step AI workflow using LangGraph
- Data storage using PostgreSQL

---

## AI Tools (LangGraph)

The system uses 5 AI tools:

1. **Log Interaction Tool**
   - Extracts structured data from user input

2. **Follow-up Tool**
   - Suggests next actions

3. **Sentiment Tool**
   - Classifies sentiment (Positive/Neutral/Negative)

4. **Summary Tool**
   - Generates short summary

5. **Recommendation Tool**
   - Provides business recommendations

---

## Tech Stack

### Frontend
- React.js
- CSS

### Backend
- FastAPI (Python)

### AI
- LangGraph
- Groq LLM (llama / gemma)

### Database
- PostgreSQL

---

## Workflow

1. User enters interaction (manual or AI chat)
2. Request sent to FastAPI backend
3. LangGraph processes input through multiple tools
4. Structured output is generated
5. Data is stored in database
6. Results displayed on UI

---

## UI

- Left Panel → Structured Interaction Form
- Right Panel → AI Assistant (Chat-based logging)

---

## How to Run

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload