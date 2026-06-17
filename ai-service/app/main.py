import contextlib
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import health, predict, simulate
from app.core.database import connect_db, disconnect_db
from app.services.graph_service import graph_service
from app.services.model_service import model_service

@contextlib.asynccontextmanager
async def lifespan(app: FastAPI):
    print("[AI Service] Connecting to PostGIS Database...")
    await connect_db()
    print("[AI Service] Loading Map Graph Data...")
    await graph_service.load_graph()
    print("[AI Service] Loading LSTM Model...")
    model_service.load_model()
    yield
    print("[AI Service] Closing PostGIS Database connection...")
    await disconnect_db()

app = FastAPI(
    title="CivicTwin AI Service",
    description="Prediction & Simulation engine for CivicTwin AI — Predictive & Proactive traffic management",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:8000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(predict.router, prefix="/api")
app.include_router(simulate.router, prefix="/api")
