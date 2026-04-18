from fastapi import FastAPI
from pydantic import BaseModel
from agent import app_graph
from database import engine, SessionLocal
from models import Base, InteractionDB
from fastapi.middleware.cors import CORSMiddleware
import json

app = FastAPI()

# Create DB tables
Base.metadata.create_all(bind=engine)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Schema
class Interaction(BaseModel):
    hcp_name: str = ""
    interaction_type: str = ""
    summary: str = ""
    sentiment: str = ""


# Save manual
@app.post("/log-interaction")
def log_interaction(data: Interaction):
    db = SessionLocal()
    try:
        interaction = InteractionDB(
            hcp_name=data.hcp_name,
            interaction_type=data.interaction_type,
            summary=data.summary,
            sentiment=data.sentiment
        )
        db.add(interaction)
        db.commit()
        return {"message": "Saved"}
    finally:
        db.close()


# Get all
@app.get("/interactions")
def get_all():
    db = SessionLocal()
    try:
        return db.query(InteractionDB).all()
    finally:
        db.close()


# AI route
@app.post("/ai-log")
def ai_log(data: dict):
    result = app_graph.invoke({
        "input": data.get("input", "")
    })

    try:
        parsed = json.loads(result.get("output", "{}"))
    except:
        parsed = {}

    interaction_data = parsed.get("interaction", {})

    db = SessionLocal()
    try:
        interaction = InteractionDB(
            hcp_name=interaction_data.get("hcp_name", ""),
            interaction_type=interaction_data.get("interaction_type", ""),
            summary=parsed.get("summary", ""),
            sentiment=parsed.get("sentiment", "")
        )
        db.add(interaction)
        db.commit()
    finally:
        db.close()

    return parsed