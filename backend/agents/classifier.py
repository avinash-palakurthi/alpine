from state import AgentState
from langchain_openai import OpenAIEmbeddings
from langchain_qdrant import QdrantVectorStore
from qdrant_client import QdrantClient
from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()

# Connect to Qdrant
qdrant = QdrantClient(
    url=os.getenv("QDRANT_URL"),
    api_key=os.getenv("QDRANT_API_KEY")
)

# Setup embeddings
embeddings = OpenAIEmbeddings(
    model="text-embedding-3-small",
    api_key=os.getenv("OPENAI_API_KEY")
)

# Connect to existing collection
vector_store = QdrantVectorStore(
    client=qdrant,
    collection_name=os.getenv("QDRANT_COLLECTION"),
    embedding=embeddings
)

# OpenAI client
openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def classifier_node(state: AgentState) -> AgentState:

    product = state["product"]

    # Step 1: Search Qdrant
    try:
        search_results = vector_store.similarity_search(
            query=product,
            k=3
        )
        context = "\n".join([doc.page_content for doc in search_results])
    except Exception as e:
        print(f"Qdrant search failed: {e}")
        context = "No context found"

    # Step 2: Ask GPT
    try:
        response = openai_client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": """You are a CBAM trade compliance expert.
Given a product description and EU regulation context,
find the correct CN code.

Reply in this exact format only:
CN_CODE: [4 digit code]
CONFIDENCE: [high or medium or low]
CATEGORY: [product category name]

If you cannot find the CN code reply:
CN_CODE: unknown
CONFIDENCE: low
CATEGORY: unknown"""
                },
                {
                    "role": "user",
                    "content": f"""Product: {product}

Regulation context:
{context}

What is the CN code for this product?"""
                }
            ]
        )
        result = response.choices[0].message.content

    except Exception as e:
        print(f"OpenAI failed: {e}")
        state["cn_code"]    = "unknown"
        state["confidence"] = "low"
        state["category"]   = "unknown"
        return state

    # Step 3: Parse response
    for line in result.split("\n"):
        line = line.strip()
        if line.startswith("CN_CODE:"):
            state["cn_code"]    = line.replace("CN_CODE:", "").strip()
        if line.startswith("CONFIDENCE:"):
            state["confidence"] = line.replace("CONFIDENCE:", "").strip()
        if line.startswith("CATEGORY:"):
            state["category"]   = line.replace("CATEGORY:", "").strip()

    return state