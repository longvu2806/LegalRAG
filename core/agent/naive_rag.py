from typing import Any, Dict, List
from langchain_core.documents import Document
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_ollama import ChatOllama


class NaiveRAGService:
  """Orchestrates naive retrieval-augmented generation using a local LLM."""

  def __init__(
      self,
      retriever: Any,
      model_name: str = "qwen2.5:3b",
      ollama_base_url: str = "http://localhost:11434",
  ):
    self.retriever = retriever
    self.llm = ChatOllama(
        model=model_name,
        base_url=ollama_base_url,
        temperature=0.0,  # Zero temperature for deterministic legal factual answers
    )
    self.prompt = self._build_prompt_template()
    self.chain = self._build_chain()

  def _build_prompt_template(self) -> ChatPromptTemplate:
    template = """You are a legal reasoning assistant. Answer the user query strictly using the provided statutory context.
If the provided context does not contain enough facts to answer, clearly state that the law provisions are not found.

Statutory Context:
{context}

User Query: {question}

Response Instructions:
- State applicable Article/Decree numbers clearly.
- Provide step-by-step statutory deduction.
- Answer in Vietnamese if the question is in Vietnamese."""
    return ChatPromptTemplate.from_template(template)

  @staticmethod
  def _format_docs(docs: List[Document]) -> str:
    return "\n\n".join(
        [
            f"[Source: {d.metadata.get('doc_code', 'Unknown')}]\n{d.page_content}"
            for d in docs
        ]
    )

  def _build_chain(self):
    return (
        {
            "context": self.retriever | self._format_docs,
            "question": RunnablePassthrough(),
        }
        | self.prompt
        | self.llm
    )

  def query(self, question: str) -> Dict[str, Any]:
    """Executes retrieval and generation for a given question."""
    # Retrieve raw docs first to verify context traceability
    retrieved_docs = self.retriever.invoke(question)
    response = self.chain.invoke(question)

    return {
      "question": question,
      "answer": response.content,
      "retrieved_documents": [
          {"content": doc.page_content, "metadata": doc.metadata}
          for doc in retrieved_docs
      ],
  }