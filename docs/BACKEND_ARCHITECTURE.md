# Backend Architecture

- FastAPI app in `backend/app/main.py`.
- API router in `backend/app/api/v1/router.py`.
- Config in `backend/app/core`.
- Mongo lifecycle and indexes in `backend/app/db`.
- Domain models in `backend/app/models`.
- Repository fallback in `backend/app/repositories`.
- Business logic in `backend/app/services`.

Business logic is kept outside endpoint functions where practical.
