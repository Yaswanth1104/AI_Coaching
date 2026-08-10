from typing import TypedDict, Dict, Any

from langgraph.graph import StateGraph, START, END

from agents.customer_understanding import analyze_customer_message
from agents.knowledge_agent import search_knowledge
from agents.coach_agent import generate_coach_suggestion
from agents.quality_agent import evaluate_response
from agents.supervisor_agent import supervisor_review
from agents.escalation_agent import analyze_escalation
from agents.post_interaction_summary import generate_interaction_summary


# ==========================================================
# LangGraph State
# ==========================================================

class SupportState(TypedDict, total=False):

    # Current customer message
    message: str

    # Previous conversation memory
    conversation_context: str

    # Agent outputs
    understanding: Dict[str, Any]

    knowledge: Dict[str, Any]

    coach: Dict[str, Any]

    quality: Dict[str, Any]

    escalation: Dict[str, Any]

    supervisor: Dict[str, Any]

    post_interaction_summary: Dict[str, Any]


# ==========================================================
# Helper - Build Contextual Message
# ==========================================================

def build_contextual_message(state: SupportState):
    """
    Combine previous conversation memory with
    the current customer message.

    This helps agents understand follow-up messages
    such as:

    "can you give me the steps?"
    "what should I do now?"
    "it is still not working"
    """

    current_message = state.get(
        "message",
        ""
    ).strip()

    conversation_context = state.get(
        "conversation_context",
        ""
    ).strip()

    # No useful previous context
    if (
        not conversation_context
        or conversation_context
        == "No previous conversation context."
    ):

        return current_message

    contextual_message = f"""
Previous Conversation:

{conversation_context}

Current Customer Message:

{current_message}

Important:
Understand the current customer message using the previous
conversation when it is clearly a follow-up.
"""

    return contextual_message.strip()


# ==========================================================
# Node 1 - Customer Understanding Agent
# ==========================================================

def understanding_node(state: SupportState):

    print("\n" + "=" * 80)
    print("LANGGRAPH -> CUSTOMER UNDERSTANDING AGENT")
    print("=" * 80)

    contextual_message = build_contextual_message(
        state
    )

    print("\nCONTEXT SENT TO UNDERSTANDING AGENT:")
    print(contextual_message)

    result = analyze_customer_message(
        contextual_message
    )

    return {
        "understanding": result
    }


# ==========================================================
# Node 2 - Knowledge Recommendation Agent (RAG)
# ==========================================================

def knowledge_node(state: SupportState):

    print("\n" + "=" * 80)
    print("LANGGRAPH -> KNOWLEDGE RECOMMENDATION AGENT")
    print("=" * 80)

    contextual_message = build_contextual_message(
        state
    )

    print("\nCONTEXT SENT TO RAG:")
    print(contextual_message)

    result = search_knowledge(
        contextual_message
    )

    return {
        "knowledge": result
    }


# ==========================================================
# Node 3 - Coach Agent
# ==========================================================

def coach_node(state: SupportState):

    print("\n" + "=" * 80)
    print("LANGGRAPH -> COACH AGENT")
    print("=" * 80)

    contextual_message = build_contextual_message(
        state
    )

    result = generate_coach_suggestion(
        contextual_message,
        state["knowledge"]
    )

    return {
        "coach": result
    }


# ==========================================================
# Node 4 - Quality Agent
# ==========================================================

def quality_node(state: SupportState):

    print("\n" + "=" * 80)
    print("LANGGRAPH -> QUALITY AGENT")
    print("=" * 80)

    # Quality evaluation should evaluate the response
    # against the CURRENT customer message.
    result = evaluate_response(
        state["message"],
        state["coach"]["recommended_response"]
    )

    return {
        "quality": result
    }


# ==========================================================
# Node 5 - Escalation Risk Agent
# ==========================================================

def escalation_node(state: SupportState):

    print("\n" + "=" * 80)
    print("LANGGRAPH -> ESCALATION RISK AGENT")
    print("=" * 80)

    # Escalation receives current message plus
    # understanding generated with conversation memory.
    result = analyze_escalation(
        state["message"],
        state["understanding"],
        state["coach"],
        state["quality"]
    )

    return {
        "escalation": result
    }


# ==========================================================
# Node 6 - Supervisor Agent
# ==========================================================

def supervisor_node(state: SupportState):

    print("\n" + "=" * 80)
    print("LANGGRAPH -> SUPERVISOR AGENT - FINAL REVIEW")
    print("=" * 80)

    result = supervisor_review(
        state["message"],
        state["understanding"],
        state["coach"],
        state["quality"],
        state["escalation"]
    )

    return {
        "supervisor": result
    }


# ==========================================================
# Node 7 - Post-Interaction Summary Agent
# ==========================================================

def post_interaction_summary_node(
    state: SupportState
):

    print("\n" + "=" * 80)
    print(
        "LANGGRAPH -> POST-INTERACTION SUMMARY AGENT"
    )
    print("=" * 80)

    result = generate_interaction_summary(
        state["message"],
        state["coach"]["recommended_response"],
        state["understanding"],
        state["quality"],
        state["escalation"]
    )

    return {
        "post_interaction_summary": result
    }


# ==========================================================
# Create LangGraph
# ==========================================================

builder = StateGraph(
    SupportState
)


# ==========================================================
# Add Agent Nodes
# ==========================================================

builder.add_node(
    "customer_understanding",
    understanding_node
)

builder.add_node(
    "knowledge_recommendation",
    knowledge_node
)

builder.add_node(
    "coach",
    coach_node
)

builder.add_node(
    "quality",
    quality_node
)

builder.add_node(
    "escalation",
    escalation_node
)

builder.add_node(
    "supervisor",
    supervisor_node
)

builder.add_node(
    "post_interaction_summary",
    post_interaction_summary_node
)


# ==========================================================
# Connect Agent Workflow
# ==========================================================

builder.add_edge(
    START,
    "customer_understanding"
)

builder.add_edge(
    "customer_understanding",
    "knowledge_recommendation"
)

builder.add_edge(
    "knowledge_recommendation",
    "coach"
)

builder.add_edge(
    "coach",
    "quality"
)

builder.add_edge(
    "quality",
    "escalation"
)

builder.add_edge(
    "escalation",
    "supervisor"
)

builder.add_edge(
    "supervisor",
    "post_interaction_summary"
)

builder.add_edge(
    "post_interaction_summary",
    END
)


# ==========================================================
# Compile LangGraph
# ==========================================================

support_graph = builder.compile()


# ==========================================================
# Debug Graph Creation
# ==========================================================

print("\n" + "=" * 80)
print("LANGGRAPH SUPPORT WORKFLOW CREATED")
print("=" * 80)

print(
    "Customer Understanding "
    "-> Knowledge Recommendation "
    "-> Coach "
    "-> Quality "
    "-> Escalation "
    "-> Supervisor "
    "-> Post-Interaction Summary"
)

print("\nConversation Memory: ENABLED")

print("=" * 80)