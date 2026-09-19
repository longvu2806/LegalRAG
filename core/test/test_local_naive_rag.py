import sys
from pathlib import Path


sys.path.append(str(Path(__file__).resolve().parent.parent.parent))

from core.agent.naive_rag import NaiveRAGService
from core.ingestion.naive_ingestor import NaiveIngestor
from core.storage.vector_store import VectorStoreManager


def main():
  print("=== Step 1: Initializing Local Vector Store (Ollama Embeddings) ===")
  vdb_manager = VectorStoreManager(
      collection_name="local_legal_demo",
      storage_path="./qdrant_local_demo",
      embedding_model="nomic-embed-text",
  )

  print("\n=== Step 2: Ingesting Sample Law Corpus ===")
  ingestor = NaiveIngestor(vector_store_manager=vdb_manager, chunk_size=300)

  sample_statutes = """
    Điều 60. Tuổi, sức khỏe của người lái xe (Luật Giao thông đường bộ 2008)
    1. Độ tuổi của người lái xe quy định như sau:
    a) Người đủ 16 tuổi trở lên được lái xe gắn máy có dung tích xi-lanh dưới 50 cm3;
    b) Người đủ 18 tuổi trở lên được lái xe mô tô hai bánh, xe mô tô ba bánh có dung tích xi-lanh từ 50 cm3 trở lên.

    Điều 21. Xử phạt các hành vi vi phạm quy định về điều kiện của người điều khiển xe cơ giới (Nghị định 100/2019/NĐ-CP)
    4. Phạt tiền từ 400.000 đồng đến 600.000 đồng đối với một trong các hành vi vi phạm sau đây:
    a) Người từ đủ 16 tuổi đến dưới 18 tuổi điều khiển xe mô tô có dung tích xi-lanh từ 50 cm3 trở lên.
    """

  ingestor.ingest_text(
      raw_text=sample_statutes,
      metadata={"doc_code": "VBPL_GIAOTHONG", "status": "active"},
  )

  print("\n=== Step 3: Setting Up Local RAG Engine (Ollama LLM) ===")
  rag_service = NaiveRAGService(
      retriever=vdb_manager.get_retriever(k=2),
      model_name="qwen2.5:7b",  # or llama3.2:3b
  )

  print("\n=== Step 4: Testing Query Inference ===")
  query = "Người 17 tuổi đi xe máy 110cc có bị phạt không và mức phạt là bao nhiêu?"
  print(f"Query: '{query}'\n")

  result = rag_service.query(query)

  print("---------------- RETRIEVED CHUNKS ----------------")
  for i, doc in enumerate(result["retrieved_documents"], 1):
    print(f"[{i}] {doc['content'].strip()}\n")

  print("---------------- LOCAL LLM RESPONSE ----------------")
  print(result["answer"])


if __name__ == "__main__":
  main()