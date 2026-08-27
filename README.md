# 🤖 AI Support Coaching System

An AI-powered customer support coaching system that uses multiple specialized AI agents, RAG, and LangGraph to analyze customer messages, retrieve relevant knowledge, generate support responses, evaluate response quality, detect escalation risk, and create interaction summaries.

---

## 📌 Project Overview

The AI Support Coaching System helps customer support teams handle customer conversations more effectively.

Instead of relying on a single AI model, the system uses multiple specialized agents. Each agent performs a specific task and passes its result to the next agent through a shared LangGraph state.

The system can:

- Understand customer intent and sentiment
- Retrieve relevant information from a knowledge base
- Generate recommended support responses
- Evaluate response quality
- Detect escalation risk
- Perform a final supervisor review
- Generate a post-interaction summary

---

## 🎯 Problem Statement

Customer support agents often need to:

- Understand customer issues quickly
- Search company knowledge bases
- Create accurate and professional responses
- Identify frustrated customers
- Decide when an issue needs escalation
- Maintain consistent response quality
- Summarize conversations for future reference

Handling all these tasks manually can be time-consuming and inconsistent.

This project provides an AI-assisted workflow to support customer service teams throughout the interaction.

---

## 💡 Solution

The system uses a multi-agent architecture where each AI agent is responsible for a specific task.

The agents work together through LangGraph and share information using a centralized `SupportState`.

### Workflow

Customer Message

↓

Customer Understanding Agent

↓

Knowledge Recommendation Agent (RAG)

↓

Coach Agent

↓

Quality Agent

↓

Escalation Risk Agent

↓

Supervisor Agent

↓

Post-Interaction Summary Agent

↓

Final Result

---

## 🤖 AI Agents

### 1. Customer Understanding Agent

Analyzes the customer message and identifies important information such as:

- Customer intent
- Sentiment
- Customer issue
- Conversation context

It also uses previous conversation context when the current message is a follow-up.

---

### 2. Knowledge Recommendation Agent

Uses Retrieval-Augmented Generation (RAG) to find relevant information from the project's knowledge base.

It provides useful company information that can help generate an accurate response.

---

### 3. Coach Agent

Uses the customer message and retrieved knowledge to generate a recommended response for the support agent.

The goal is to provide a response that is:

- Helpful
- Relevant
- Professional
- Context-aware

---

### 4. Quality Agent

Evaluates the recommended response.

It checks whether the response is appropriate for the customer's current issue and provides a quality evaluation.

---

### 5. Escalation Risk Agent

Analyzes the customer message, understanding, recommended response, and quality evaluation to determine whether the conversation may require escalation.

It helps identify potentially high-risk or unresolved customer situations.

---

### 6. Supervisor Agent

Performs a final review of the customer interaction.

It considers:

- Customer issue
- Customer understanding
- Recommended response
- Quality evaluation
- Escalation risk

The supervisor provides the final review of the generated recommendation.

---

### 7. Post-Interaction Summary Agent

Generates a structured summary of the interaction.

The summary can include:

- Customer issue
- Intent
- Recommended response
- Quality result
- Escalation information

This can be useful for maintaining conversation records and future support.

---

## 🧠 LangGraph Architecture

LangGraph is used to orchestrate the multi-agent workflow.

The project uses a shared `SupportState` to pass information between agents.

The state contains:

```python
message
conversation_context
understanding
knowledge
coach
quality
escalation
supervisor
post_interaction_summary
```

Each node reads the information it needs from the state and adds its own result back to the state.

### LangGraph Flow

```text
START
  |
  v
Customer Understanding
  |
  v
Knowledge Recommendation (RAG)
  |
  v
Coach
  |
  v
Quality
  |
  v
Escalation
  |
  v
Supervisor
  |
  v
Post-Interaction Summary
  |
  v
END
```

---

## 📚 RAG Pipeline

The Knowledge Recommendation Agent uses a Retrieval-Augmented Generation approach.

The general workflow is:

```text
Customer Message
      |
      v
Query Processing
      |
      v
Knowledge Base Search
      |
      v
Relevant Documents
      |
      v
Retrieved Knowledge
      |
      v
Coach Agent
      |
      v
Recommended Response
```

RAG helps the system generate responses using relevant information from the project's knowledge base instead of relying only on the language model's general knowledge.

---

## 🧠 Conversation Context

The system supports conversation context.

For example:

```text
Customer:
My payment failed.

Support:
Please try the payment again.

Customer:
It is still not working.
```

The final message:

```text
"It is still not working."
```

can be interpreted using the previous conversation context.

This helps the system understand follow-up customer messages more accurately.

---

## 🛠️ Tech Stack

### Backend

- Python
- FastAPI

### AI / LLM

- Large Language Model
- LangGraph
- RAG

### Vector Search

- ChromaDB

### Frontend

- React
- JavaScript
- CSS

### Development Tools

- Git
- GitHub
- VS Code

---

## 📁 Project Structure

```text
AI_Coaching/
│
├── agents/
│   ├── customer_understanding.py
│   ├── knowledge_agent.py
│   ├── coach_agent.py
│   ├── quality_agent.py
│   ├── escalation_agent.py
│   ├── supervisor_agent.py
│   └── post_interaction_summary.py
│
├── backend/
│
├── frontend/
│
├── README.md
├── LICENSE
├── .gitignore
├── requirements.txt
└── package.json
```

> The exact structure may change as the project evolves.

---

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/Yaswanth1104/AI_Coaching.git
```

### 2. Navigate to the project

```bash
cd AI_Coaching
```

### 3. Create a virtual environment

```bash
python -m venv venv
```

### 4. Activate the virtual environment

#### Windows

```bash
venv\Scripts\activate
```

#### macOS / Linux

```bash
source venv/bin/activate
```

### 5. Install Python dependencies

```bash
pip install -r requirements.txt
```

---

## 🔐 Environment Variables

Create a `.env` file for required API keys and configuration.

Example:

```env
OPENAI_API_KEY=your_api_key_here
```

Never commit real API keys or secrets to GitHub.

Use `.env.example` to document required environment variables without exposing secret values.

---

## ▶️ Running the Project

Start the backend using the project's configured FastAPI entry point.

Example:

```bash
uvicorn main:app --reload
```

Start the frontend using:

```bash
npm install
npm run dev
```

> Update the commands above if the project's actual entry-point files use different names.

---

## 🔄 Example Interaction

### Customer Message

```text
I ordered my product several days ago but it still hasn't arrived.
```

### Customer Understanding

```text
Intent: Delivery Issue
Sentiment: Negative
```

### Knowledge Recommendation

```text
Relevant delivery and order-tracking information
```

### Coach

```text
Recommended support response
```

### Quality

```text
Response quality evaluation
```

### Escalation

```text
Escalation risk assessment
```

### Supervisor

```text
Final review
```

### Summary

```text
Structured interaction summary
```

---

## ✨ Key Features

- Multi-agent AI architecture
- LangGraph workflow orchestration
- Shared state management
- Retrieval-Augmented Generation (RAG)
- Conversation context support
- AI response coaching
- Response quality evaluation
- Escalation risk detection
- Supervisor review
- Post-interaction summarization
- FastAPI backend
- React frontend

---

## 🚀 Future Enhancements

Possible future improvements include:

- Real-time customer support integration
- Authentication and role-based access
- Conversation history database
- Advanced analytics dashboard
- Agent performance analytics
- Human-in-the-loop approval
- Improved escalation workflows
- Streaming AI responses
- Better knowledge-base management
- Production deployment

---

## 📄 License

This project is licensed under the MIT License.

See the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**YASWANTH GUDE**

GitHub: https://github.com/Yaswanth1104

---

## ⭐ Project

If you find this project useful or interesting, consider giving the repository a star.