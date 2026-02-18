# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MuSP is a web application that downloads audio from YouTube links and separates vocals from instruments using the Demucs model. The architecture consists of a Next.js frontend with Jotai state management, a FastAPI backend with Celery for async processing, and Google Cloud infrastructure (BigQuery + Cloud Storage).

## Common Development Commands

### Frontend (view/)
```bash
cd view
npm run dev              # Start Next.js dev server (port 3000)
npm run build            # Production build
npm run typecheck        # TypeScript validation
npm run lint             # Run ESLint + Stylelint
npm run test             # Run all tests (prettier, lint, typecheck, jest)
npm run jest             # Run Jest tests only
npm run jest:watch       # Jest watch mode
npm run storybook        # Start Storybook (port 6006)
npm run prettier:write   # Format code
```

### Backend (api/)
From the api/ directory:
```bash
pip3 install -r requirements.txt
PYTHONPATH=src uvicorn openapi_server.main:app --host 0.0.0.0 --port 8080
PYTHONPATH=src pytest tests  # Run tests
```

### Docker (Root)
```bash
make build               # Build development containers
make up                  # Start development environment
make down                # Stop containers
make prod-build          # Build production containers
make prod-up             # Start production environment
make logs                # View container logs

# Alternative: Direct Docker Compose commands
docker compose up --build
docker compose down
```

### Code Generation
```bash
make gen-py              # Regenerate Python API from openapi.yaml
make gen-ts              # Regenerate TypeScript client from openapi.yaml
make gen                 # Regenerate both
```

## High-Level Architecture

### Frontend Architecture (view/)

**Technology Stack**: Next.js 15 + React 19, Jotai for state management, Zodios for type-safe API client, Mantine UI, Firebase Auth

**State Management Pattern (Jotai)**:
- Atomic state with derived selectors for computed values
- Key atoms: `audioQueueAtom` (playlist), `currentIndexAtom` (current track), `songMapAtom` (video metadata), `trackTypeAtom` ('vocal' or 'inst')
- Selectors: `wavURLAtom` (current audio URL), `titleAtom`, `thumbnailAtom`
- localStorage-backed atoms for persistence: `userIDAtom`, `trackTypeAtom`

**Component Structure**:
- Server components at root (app/layout.tsx, app/page.tsx)
- Client components marked with "use client" (forms, audio player, modals)
- Components organized by feature: Home/, Header/, Footer/, Buttons/

**API Client (Zodios)**:
- Schema-driven, type-safe client with Zod validation
- Client auto-generated from openapi.yaml via `make gen-ts`
- All API calls go through `client/api.ts` using `useQuery` pattern

**Custom Hooks Pattern**:
- `useVideoData()`: Fetch user videos, submit new YouTube URLs, normalize API responses to Record format
- `useAudioPlayer()`: Queue controls (next, prev, playAt, switchTrack)
- `useAudioSync()`: Sync API responses to Jotai atoms

### Backend Architecture (api/)

**Technology Stack**: FastAPI (async Python), Celery for task queue, Redis broker, Google BigQuery (database), Google Cloud Storage (audio files), yt-dlp (YouTube download), Demucs (vocal separation)

**Request Flow**:
1. **User Registration**: `POST /users` → BigQuery insert google_id → user_id mapping
2. **Video Submission**: `POST /video` → Check if duplicate → Insert user-videoID mapping → Trigger Celery chain → Return youtube_id
3. **Async Processing Chain** (Celery):
   - `fetch_source()`: Download YouTube video with yt-dlp
   - `separate_source()`: Separate vocals/instruments with Demucs
   - `upload_source()`: Upload WAV files to Google Cloud Storage
   - `update_video_status()`: Update BigQuery with COMPLETED status
   - `publish_source()`: Trigger cron job for URL refresh
   - `post_run()`: Cleanup temp files
4. **Retrieve Videos**: `GET /{user_id}` → JOIN query across BigQuery tables → Return array of {youtube_id, vocal_wav_url, inst_wav_url}

**Implementation Layer Pattern**:
- API routes in `apis/` define FastAPI endpoints
- Implementation logic in `impl/` with base class pattern
- Subclass registry auto-discovers implementations
- This separation enables clean testing and mocking

**BigQuery Schema** (normalized):
- `googleID-userID`: google_id → user_id mapping
- `userID-videoID`: user_id → video_id mapping with timestamps
- `videoID-status`: Processing status per video (PENDING, PROCESSING, COMPLETED, FAILED)
- `videoID-vocalWavURL`: video_id → vocal audio URL
- `videoID-instWavURL`: video_id → instrumental audio URL

### Integration Points

**Frontend → Backend**:
- API Key authentication via `X-API-KEY` header
- Standardized response format: `{status_code, status_message, data}`
- DTO pattern: API responses normalized to Record format for O(1) lookups

**Frontend Audio Playback**:
- Jotai `wavURLAtom` provides current audio URL from API response
- URLs point to Google Cloud Storage (publicly accessible)
- Track switching updates `currentIndexAtom` → selectors recompute

## Important Conventions

### API Development
- **Never manually edit auto-generated files** in `api/src/openapi_server/models/` or `view/client/client.ts`
- Update `openapi.yaml` first, then run `make gen` to regenerate
- All BigQuery queries must use parameterized queries (prevent SQL injection)
- Celery tasks must include error handling and use `self.update_state()` for progress tracking

### Frontend Development
- Keep Jotai atoms minimal; use selectors (derived atoms) for computed values
- Never mutate atoms directly; use `set()` or `update()` functions
- Use DTO pattern to normalize API responses to Record format
- Custom hooks should encapsulate business logic and compose Jotai atoms

### Type Safety
- Leverage Zod + TypeScript throughout; avoid `any` types
- API contract enforced by Zodios (validates requests/responses at runtime)
- Backend uses Pydantic models (auto-generated from OpenAPI)

### Testing
- Frontend: Jest + React Testing Library for hooks/components, Storybook for component isolation
- Backend: Pytest with `PYTHONPATH=src pytest tests`
- Test hooks in isolation using test-utils/render.tsx

### Environment Configuration
- Frontend: `NEXT_PUBLIC_*` prefixed env vars for client-side access
- Backend: `.env` files loaded by Docker Compose
- Firebase config loaded from environment in LoginButton component
- GCP credentials mounted to backend container

## Docker Services

The Docker Compose setup includes:
- **view**: Next.js dev server (port 3000), hot reload enabled
- **api**: FastAPI/Uvicorn (port 8000), auto-reload on file changes
- **celery**: Celery worker with GPU support for Demucs processing
- **cron**: Scheduled job runner (refreshes WAV URLs in BigQuery every 60 minutes)
- **redis**: Message broker for Celery (port 6379)

## Data Flow Example: Submitting a YouTube Video

1. User enters YouTube URL in `MuspForm`
2. Frontend calls `useVideoData.addVideo(url)` → `POST /video`
3. Backend checks BigQuery for duplicate, inserts user-videoID mapping, triggers Celery chain
4. Frontend optimistically adds card with placeholder URLs
5. Celery chain executes: download → separate → upload → update status
6. Frontend polls `GET /{user_id}` to refresh URLs
7. When URLs available, audio player streams from Google Cloud Storage
