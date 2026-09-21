from typing import Any, Dict, List, Optional
from core.storage.vector_store import VectorStoreManager
from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter


class NaiveIngestor:
  """Executes naive character-based document chunking and vector store ingestion."""

  def __init__(
      self,
      vector_store_manager: VectorStoreManager,
      chunk_size: int = 500,
      chunk_overlap: int = 50,
  ):
    """Initializes the NaiveIngestor with chunking parameters.

    Args:
        vector_store_manager (VectorStoreManager): The target vector store
          manager.
        chunk_size (int): Maximum character length per chunk.
        chunk_overlap (int): Overlap character count between consecutive
          chunks.
    """
    self.vdb_manager = vector_store_manager
    self.splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
        separators=["\n\n", "\n", ". ", " ", ""],
    )

  def ingest_text(
      self, raw_text: str, metadata: Optional[Dict[str, Any]] = None
  ) -> List[Document]:
    """Splits raw text and persists chunk embeddings into the vector database.

    Args:
        raw_text (str): Source document content.
        metadata (Optional[Dict[str, Any]]): Contextual metadata (e.g.,
          tenant_id, source).

    Returns:
        List[Document]: The list of created Document objects.
    """
    base_metadata = metadata or {}

    # Step 1: Fixed-size character splitting
    text_chunks = self.splitter.split_text(raw_text)
    print(f"[Ingestion] Generated {len(text_chunks)} chunks from source text.")

    # Step 2: Wrap into LangChain Document primitives with indexing metadata
    documents = [
        Document(
            page_content=chunk,
            metadata={**base_metadata, "chunk_index": idx},
        )
        for idx, chunk in enumerate(text_chunks)
    ]

    # Step 3: Embed and index into vector database
    self.vdb_manager.vector_store.add_documents(documents)
    print(
        f"[Ingestion] Successfully indexed {len(documents)} documents into"
        " vector store."
    )

    return documents