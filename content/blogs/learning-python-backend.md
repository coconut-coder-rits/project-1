# My Journey from Frontend Vanilla JS to Python & Backend Fundamentals

*Published on August 15, 2026 • 4 min read • Python, Backend, API Architecture*

---

## Moving Beyond the Browser

After spending months mastering the DOM, JavaScript asynchronous patterns, and modern CSS layouts, I realized that building truly useful applications requires a rock-solid backend. That curiosity led me directly into **Python**.

Python's clean syntax and extensive ecosystem made it the perfect bridge to dive into:
- RESTful API design with FastAPI & Flask
- Asynchronous request handling and background worker threads
- Database schemas with SQLite and PostgreSQL
- LLM integration pipelines and streaming socket endpoints

```python
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="Ritvik's Microservice Engine")

class PromptRequest(BaseModel):
    query: str
    temperature: float = 0.7

@app.post("/api/stream")
async def generate_response(payload: PromptRequest):
    # Streaming response generation with sub-10ms latency
    return {"status": "success", "message": f"Processing: {payload.query}"}
```

---

## The Next Frontier
I am currently working on connecting local Python microservices to my interactive frontend experiments, creating intelligent AI interfaces and real-time multiplayer canvas simulations.
