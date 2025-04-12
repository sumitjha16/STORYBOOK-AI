# 🧙♂️ Storybook AI - Harry Potter Knowledge Assistant

[![Live Demo](https://img.shields.io/badge/Demo-Live-green?style=for-the-badge)](https://storybookharry.netlify.app)  
![Interface Preview](https://via.placeholder.com/800x400.png?text=Chat+Interface+Preview+%7C+Add+actual+screenshot+here)

## 🌟 Features
- **Book-Specific Knowledge**: Answers from HP Books 1-4 only
- **Dual Response Modes**: 
  - 🎩 Freeform (storytelling style)
  - 📚 Structured (organized bullet points)
- **Chapter Summarization**: Characters, Events, Spells
- **Contextual Memory**: Remembers conversation history
- **Streaming Responses**: Real-time answer generation
- **Source Citations**: Shows book/chapter references

## 🏰 High-Level Architecture
```mermaid
graph TD
  A[Frontend] -->|HTTP| B[FastAPI]
  B --> C[RAG System]
  C --> D[Mistral LLM]
  C --> E[ChromaDB]
  F[PDF Processor] --> E
  G[Embeddings] --> E
  H[Monitoring] --> B
🚀 User Journey
User asks question about HP universe

System checks books 1-4 knowledge

RAG finds relevant text passages

LLM generates contextual response

Response streamed back with sources

Conversation history maintained

🔧 Backend Magic
Request Processing Flow
Request received via API endpoint

Auth/validation checks

Query enhancement with conversation history

Vector similarity search in ChromaDB

Context-aware LLM generation

Response formatting & streaming

Metrics collection & monitoring

Key Components
Component	Tech Stack	Purpose
API Layer	FastAPI, Uvicorn	Request handling
RAG Engine	LangChain, ChromaDB	Context retrieval
LLM	Mistral-7B	Response generation
Embeddings	all-MiniLM-L6-v2	Text vectorization
Monitoring	Prometheus, Grafana	Performance tracking
📡 API Endpoints
Endpoint	Method	Description
/chat	POST	Main chat interface
/summarize	POST	Generate summaries
/health	GET	System status check
/clear-memory	GET	Reset conversation
/metrics	GET	Prometheus metrics
🎨 Frontend Design
Dual-Pane Interface

Left: Chat Interface (Messages + Input)

Right: Summary Generator (Dropdowns + Display)

Theming System

Light/Dark mode toggle

Hogwarts House Themes:

🦁 Gryffindor (Red/Gold)

🐍 Slytherin (Green/Silver)

🦡 Hufflepuff (Yellow/Black)

🦅 Ravenclaw (Blue/Bronze)

Key React Components

Streaming response handler

Source citation parser

Dynamic theme switcher

Summary typeahead search

🛠️ Local Setup Guide
Prerequisites
Python 3.10+

Node.js 16+

Mistral API Key

8GB+ RAM recommended

1. Clone Repository
bash
Copy
git clone https://github.com/yourusername/storybook-ai.git
cd storybook-ai
2. Install Dependencies
Backend

bash
Copy
cd backend
pip install -r requirements.txt
Frontend

bash
Copy
cd frontend
npm install
3. Configure Environment
Create .env file:

ini
Copy
MISTRAL_API_KEY=your_api_key_here
DEBUG=True
CHROMA_DB_DIR=./data/processed/chroma_db
4. Prepare Data
Place HP PDFs in data/Pdfs/

Process books:

bash
Copy
python process_books.py
python create_embeddings.py
5. Run Services
Backend

bash
Copy
uvicorn main:app --reload
Frontend

bash
Copy
npm start
🧠 Knowledge Processing Pipeline
PDF Text Extraction

Chapter Segmentation

Text Cleaning/Normalization

Chunking (512 tokens)

Embedding Generation

Vector Storage (ChromaDB)

⚡ Performance Tips
Use DEBUG=False in production

Enable response caching

Limit conversation history length

Use smaller embedding model

Implement rate limiting

🚨 Troubleshooting
Common Issues

Vector Store Not Found:

Verify ChromaDB path

Re-run embedding creation

API Errors:

Check Mistral API key

Validate CORS settings

Incomplete Responses:

Increase MAX_NEW_TOKENS

Check streaming implementation

📚 Learning Resources
LangChain Docs

Mistral API Guide

FastAPI Best Practices

React Streaming Patterns

🤝 Contribution Guidelines
Fork repository

Create feature branch

Submit PR with:

Code changes

Updated tests

Documentation updates

Version bump

Magical Note: This project respects J.K. Rowling's copyrights - uses only book text analysis, no reproduction of full content.
