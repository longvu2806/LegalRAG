import os
from typing import Optional
from langchain_ollama import OllamaEmbeddings
from langchain_qdrant import QdrantVectorStore
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams


class VectorStoreManager:
  """Manages local vector database lifecycle, local embeddings, and retrieval."""

  def __init__(
      self,
      collection_name: str = "legal_documents",
      storage_path: str = "./qdrant_data",
      embedding_model: str = "nomic-embed-text",
      ollama_base_url: str = "http://localhost:11434",
  ):
    self.collection_name = collection_name
    self.embeddings = OllamaEmbeddings(
        model=embedding_model, base_url=ollama_base_url
    )

    # Embedded local Qdrant instance persisted to disk
    self.client = QdrantClient(path=storage_path)
    self._ensure_collection_exists()

    # Use QdrantVectorStore instead of the deprecated Qdrant wrapper
    self.vector_store = QdrantVectorStore(
        client=self.client,
        collection_name=self.collection_name,
        embedding=self.embeddings,
    )

  def _ensure_collection_exists(self) -> None:
    """Ensures collection exists with the dimension matching local embeddings."""
    collections = self.client.get_collections().collections
    exists = any(c.name == self.collection_name for c in collections)

    if not exists:
      # nomic-embed-text outputs 768-dimensional dense vectors
      self.client.create_collection(
          collection_name=self.collection_name,
          vectors_config=VectorParams(size=768, distance=Distance.COSINE),
      )
      print(
          f"[Storage] Initialized local collection: {self.collection_name} (dim"
          " 768)"
      )

  def get_retriever(self, k: int = 2):
    return self.vector_store.as_retriever(search_kwargs={"k": k})