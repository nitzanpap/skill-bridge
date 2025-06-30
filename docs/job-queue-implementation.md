# Job Queue Implementation

## Problem Statement

### The Challenge

Skill Bridge's ML processing pipeline is computationally intensive, taking 45-74 seconds to complete. This includes:

- Named Entity Recognition with 3 spaCy models (10-20s)
- Skill extraction & filtering (2-5s)  
- Semantic similarity analysis using SentenceTransformer (15-25s)
- RAG course retrieval from Pinecone (10-20s)
- LLM course recommendation via Cohere (5-15s)
- Final scoring (2-5s)

### The Issues

1. **Server Overload**: Multiple concurrent requests overwhelmed the server, causing crashes
2. **Poor User Experience**: Users faced long loading times with no feedback
3. **Resource Contention**: Simultaneous ML model loading consumed excessive memory
4. **Failed Requests**: Under high load, requests would timeout or fail

### Why Not Alternatives?

- **Scaling Infrastructure**: Cost-prohibitive for a proof-of-concept
- **Caching Only**: Doesn't help with unique resume/job combinations
- **Faster Models**: Would reduce accuracy significantly
- **Client-side Processing**: ML models too large for browser deployment

## Solution: Async Job Queue

### Architecture Overview

```text
Client Request → Next.js Proxy → FastAPI → Job Queue → Background Worker → ML Pipeline
     ↓                                                        ↓
Status Polling ← Next.js Proxy ← FastAPI ← Job Storage ← Result Storage
```

### Core Components

#### 1. Job Queue Service (`backend/app/services/job_queue_service.py`)

- **In-memory storage** for jobs (Redis-ready for production)
- **Background worker** processing jobs sequentially
- **Atomic position assignment** preventing race conditions
- **NumPy serialization handling** for ML pipeline compatibility

#### 2. Job API Routes (`backend/app/api/job_routes.py`)

- `POST /jobs/submit` - Submit new job, get immediate job ID
- `GET /jobs/status/{job_id}` - Poll job status and results
- `GET /jobs/queue/status` - Queue statistics and health

#### 3. Client-side Integration (`client/lib/job-api.ts`)

- **Smart polling** with exponential backoff (200ms → 2s)
- **Status callbacks** for real-time UI updates
- **Cancellation support** for user-initiated aborts
- **Next.js proxy compatibility** for seamless API routing

## Implementation Details

### Job Lifecycle

1. **Submission**

   ```typescript
   const job = await submitJob({
     type: JobType.COURSE_RECOMMENDATION,
     payload: { resume_text, job_description_text, threshold }
   })
   // Returns: { job_id, status: 'queued', position_in_queue: 3, estimated_wait_seconds: 120 }
   ```

2. **Status Tracking**

   ```typescript
   const result = await pollJobStatus(job_id, (status) => {
     if (status.status === 'queued') {
       showMessage(`Position ${status.position_in_queue}, ~${status.estimated_wait_seconds}s wait`)
     } else if (status.status === 'running') {
       showMessage('Processing your request...')
     }
   })
   ```

3. **Completion**

   ```typescript
   if (result.status === 'completed') {
     const analysisData = result.result // Full ML pipeline results
   }
   ```

### Queue Management

- **FIFO Processing**: Jobs processed in submission order
- **Position Tracking**: Users see real-time queue position
- **Wait Time Estimation**: Based on average job duration (60s)
- **Automatic Cleanup**: Completed jobs removed after 24 hours

### Serialization Compatibility

A critical challenge was ensuring ML pipeline outputs (containing NumPy types) could pass through the Next.js proxy:

```python
def ensure_json_serializable(obj):
    """Ensure compatibility between FastAPI and Next.js proxy"""
    try:
        json.dumps(obj)  # Test actual JSON serialization
        return obj
    except (TypeError, ValueError):
        return str(obj)  # Fallback for complex types
```

**Why This Was Needed:**

- FastAPI's Pydantic can serialize NumPy types
- Next.js proxy uses standard JavaScript JSON methods
- Without conversion, proxy fails with 500 errors while FastAPI shows 200 OK

## User Experience Improvements

### Before Queue Implementation

- ❌ 45-74 second blocking requests
- ❌ Server crashes under load
- ❌ No progress feedback
- ❌ Failed requests during peak usage

### After Queue Implementation  

- ✅ Immediate response with job ID
- ✅ Real-time progress updates
- ✅ Queue position and wait time estimates
- ✅ Graceful handling of concurrent requests
- ✅ Ability to cancel pending requests

### UI Integration

The processing modal now shows:

- **Queue status**: "Job queued (position 3, ~120s wait)"
- **Processing stages**: Entity Recognition → Similarity Analysis → Course Discovery
- **Live metrics**: Progress percentage, elapsed time, skills found
- **Cancellation**: Users can close modal to cancel polling

## Production Considerations

### Current Limitations (In-Memory Storage)

- Jobs lost on server restart
- No horizontal scaling
- Limited to single server instance

### Redis Migration Path

The service is designed for easy Redis migration:

```python
# Current: In-memory
_jobs: Dict[str, Job] = {}

# Future: Redis  
redis_client = redis.Redis(host='redis', port=6379)
```

### Monitoring & Observability

- Job completion rates
- Average processing times
- Queue depth trends
- Error rates by job type

### Performance Characteristics

- **Queue overhead**: ~50ms per job submission
- **Polling efficiency**: 200ms initial, exponential backoff to 2s
- **Memory usage**: ~1MB per queued job (including ML results)
- **Throughput**: 1 job per 45-74s (sequential processing)

## Implementation Benefits

1. **Server Stability**: Prevents overload by controlling concurrency
2. **User Experience**: Immediate feedback with progress tracking
3. **Scalability**: Foundation for horizontal scaling with Redis
4. **Maintainability**: Clean separation of concerns
5. **Monitoring**: Built-in job tracking and metrics
6. **Compatibility**: Works seamlessly with existing Next.js proxy architecture

## Future Enhancements

- **Priority Queues**: VIP users get faster processing
- **Job Persistence**: Redis integration for production reliability  
- **Horizontal Scaling**: Multiple worker instances
- **Advanced Scheduling**: Time-based job scheduling
- **Job Dependencies**: Chain related processing tasks
- **Rate Limiting**: Per-user queue limits
