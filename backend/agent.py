import os
import json
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langgraph.graph import StateGraph

load_dotenv()

#LLM
llm = ChatGroq(
    model="llama-3.1-8b-instant",
    api_key=os.getenv("GROQ_API_KEY")
)

#HELPER
def get_user_input(state):
    if isinstance(state, dict):
        if "input" in state:
            return state["input"]
        elif "messages" in state and len(state["messages"]) > 0:
            return state["messages"][-1].content
    return ""

#SAFE JSON
def safe_json_parse(text):
    try:
        return json.loads(text)
    except:
        print("⚠️ JSON parse failed:", text)
        return {}

#TOOLS

def log_interaction_tool(state):
    user_input = get_user_input(state)

    prompt = f"""
Return ONLY valid JSON. Do NOT include explanation.

{{
  "hcp_name": "",
  "interaction_type": "",
  "summary": "",
  "sentiment": ""
}}

Text: {user_input}
"""

    response = llm.invoke(prompt)
    state["interaction"] = safe_json_parse(response.content)

    return state


def followup_tool(state):
    user_input = get_user_input(state)
    response = llm.invoke(f"Suggest a follow-up action:\n{user_input}")
    state["followup"] = response.content.strip()
    return state


def sentiment_tool(state):
    user_input = get_user_input(state)
    response = llm.invoke(
        f"Return ONLY one word (Positive/Neutral/Negative):\n{user_input}"
    )
    state["sentiment"] = response.content.strip()
    return state


def summary_tool(state):
    user_input = get_user_input(state)
    response = llm.invoke(f"Summarize in 2 lines:\n{user_input}")
    state["summary"] = response.content.strip()
    return state


def recommendation_tool(state):
    user_input = get_user_input(state)
    response = llm.invoke(f"Give a recommendation:\n{user_input}")
    state["recommendation"] = response.content.strip()
    return state


def output_tool(state):
    state["output"] = json.dumps({
        "interaction": state.get("interaction", {}),
        "followup": state.get("followup", ""),
        "sentiment": state.get("sentiment", ""),
        "summary": state.get("summary", ""),
        "recommendation": state.get("recommendation", "")
    })
    return state


#GRAPH 

builder = StateGraph(dict)

builder.add_node("log", log_interaction_tool)
builder.add_node("followup", followup_tool)
builder.add_node("sentiment", sentiment_tool)
builder.add_node("summary", summary_tool)
builder.add_node("recommendation", recommendation_tool)
builder.add_node("output", output_tool)

builder.set_entry_point("log")

builder.add_edge("log", "followup")
builder.add_edge("followup", "sentiment")
builder.add_edge("sentiment", "summary")
builder.add_edge("summary", "recommendation")
builder.add_edge("recommendation", "output")

builder.set_finish_point("output")

app_graph = builder.compile()