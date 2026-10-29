from fastapi import APIRouter
from ..schemas.knowledge import KnowledgeQueryResponse, KnowledgeQueryRequest
from ..services.knowledge_service import knowledge_service

router = APIRouter(prefix="/knowledge", tags=["Construction Knowledge Assistant"])

@router.post("/query", response_model=KnowledgeQueryResponse)
async def query_knowledge(req: KnowledgeQueryRequest):
    return await knowledge_service.query_knowledge_base(req)

