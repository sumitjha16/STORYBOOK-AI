import time
import logging
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from fastapi.responses import StreamingResponse
from app.schemas.chat import ChatRequest, ChatResponse, Message, SummarizationRequest, HealthResponse
from app.llm.rag import get_rag_chain
from app.core.config import get_settings
from app.monitoring.metrics import TOKEN_COUNT, MEMORY_USAGE
from app.llm.prompts import get_system_prompt
import psutil
import asyncio

logger = logging.getLogger(__name__)
settings = get_settings()
router = APIRouter()


@router.get("/health", response_model=HealthResponse, tags=["health"])
async def health_check():
    """Health check endpoint"""
    return HealthResponse(version=settings.APP_VERSION)


@router.post("/chat", response_model=ChatResponse, tags=["chat"])
async def chat(request: ChatRequest, background_tasks: BackgroundTasks):
    """Chat endpoint"""
    start_time = time.time()

    # Extract the last user message
    if not request.messages or len(request.messages) == 0:
        raise HTTPException(status_code=400, detail="No messages provided")

    last_message = request.messages[-1]
    if last_message.role != "user":
        raise HTTPException(status_code=400, detail="Last message must be from user")

    query = last_message.content

    # Streaming response handling
    if request.stream:
        return StreamingResponse(
            generate_streaming_response(query, request.response_mode),
            media_type="text/event-stream"
        )

    # Get or create RAG chain
    rag_chain = get_rag_chain()

    # Generate response
    try:
        response_text, sources = await rag_chain.generate_response(
            query=query,
            response_mode=request.response_mode
        )

        # Update metrics in background
        background_tasks.add_task(update_metrics, "chat", len(query))

        # Calculate response time
        response_time = time.time() - start_time
        logger.info(f"Response generated in {response_time:.2f} seconds")

        return ChatResponse(
            message=Message(role="assistant", content=response_text),
            sources=sources
        )
    except Exception as e:
        logger.error(f"Error generating response: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/summarize", response_model=ChatResponse, tags=["summarization"])
async def summarize(request: SummarizationRequest, background_tasks: BackgroundTasks):
    """Summarization endpoint"""
    start_time = time.time()

    # Get RAG chain
    rag_chain = get_rag_chain()

    # Generate summary
    try:
        summary_text, sources = await rag_chain.generate_summary(
            summary_type=request.type,
            summary_target=request.target,
            response_mode=request.response_mode
        )

        # Update metrics in background
        background_tasks.add_task(update_metrics, "summarize", len(request.target))

        # Calculate response time
        response_time = time.time() - start_time
        logger.info(f"Summary generated in {response_time:.2f} seconds")

        return ChatResponse(
            message=Message(role="assistant", content=summary_text),
            sources=sources
        )
    except Exception as e:
        logger.error(f"Error generating summary: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/clear-memory", tags=["chat"])
async def clear_memory():
    """Clear the conversation memory"""
    rag_chain = get_rag_chain()
    rag_chain.memory.clear()
    return {"status": "Memory cleared"}



async def generate_streaming_response(query: str, response_mode: str):
    """Generate streaming response with more robust handling"""
    rag_chain = get_rag_chain()
    logger.info(f"Starting streaming response for query: {query}")
    
    try:
        # Send the initial "thinking" indicator
        yield "data: Thinking...\n\n"
        await asyncio.sleep(0.2)
        
        # Generate the full response first (non-streaming)
        response_text, sources = await rag_chain.generate_response(
            query=query,
            response_mode=response_mode
        )
        
        logger.info(f"Generated full response of length {len(response_text)}")
        
        # Stream the response in chunks with better handling
        words = response_text.split(' ')
        chunks = []
        current_chunk = ""
        
        # Create reasonably sized chunks by word boundaries
        for word in words:
            if len(current_chunk) + len(word) + 1 > 30:  # +1 for space
                chunks.append(current_chunk.strip())
                current_chunk = word + " "
            else:
                current_chunk += word + " "
                
        # Add the final chunk if there's anything left
        if current_chunk.strip():
            chunks.append(current_chunk.strip())
            
        # Stream each chunk with a small delay
        for i, chunk in enumerate(chunks):
            logger.debug(f"Streaming chunk {i+1}/{len(chunks)}: {chunk}")
            yield f"data: {chunk} \n\n"
            await asyncio.sleep(0.03)  # Smaller delay for smoother experience
            
        # Add source information if available
        if sources:
            source_text = "\n\nSources: " + ", ".join(sources)
            yield f"data: {source_text}\n\n"
            
        # Always signal stream completion
        logger.info("Streaming completed successfully")
        yield "data: [DONE]\n\n"
        
    except Exception as e:
        logger.error(f"Error during streaming: {e}", exc_info=True)
        error_msg = f"I encountered an error: {str(e)}"
        yield f"data: {error_msg}\n\n"
        yield "data: [DONE]\n\n"

def update_metrics(operation: str, input_length: int):
    """Update metrics after response generation"""
    # Track token count (rough estimate)
    estimated_tokens = input_length // 4
    TOKEN_COUNT.labels(operation=operation).inc(estimated_tokens)

    # Track memory usage
    memory_info = psutil.Process().memory_info()
    MEMORY_USAGE.set(memory_info.rss)

def update_metrics(operation: str, input_length: int):
    """Update metrics after response generation"""
    # Track token count (rough estimate)
    estimated_tokens = input_length // 4
    TOKEN_COUNT.labels(operation=operation).inc(estimated_tokens)

    # Track memory usage
    memory_info = psutil.Process().memory_info()
    MEMORY_USAGE.set(memory_info.rss)
