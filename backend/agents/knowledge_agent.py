from pathlib import Path

import chromadb
from chromadb.utils import embedding_functions


# ==========================================================
# ChromaDB
# ==========================================================

BASE_DIR = Path(__file__).parent.parent

CHROMA_DIR = BASE_DIR / "knowledge" / "chroma_db"

client = chromadb.PersistentClient(
    path=str(CHROMA_DIR)
)

embedding_function = (
    embedding_functions.SentenceTransformerEmbeddingFunction(
        model_name="all-MiniLM-L6-v2"
    )
)

collection = client.get_or_create_collection(
    name="support_knowledge",
    embedding_function=embedding_function
)


# ==========================================================
# Configuration
# ==========================================================

# Lower ChromaDB distance = more relevant
DISTANCE_THRESHOLD = 0.75

TOP_K = 3


# ==========================================================
# Domain Configuration
# ==========================================================

DOMAIN_RULES = {

    "internet": {
        "keywords": [
            "internet",
            "wifi",
            "wi-fi",
            "router",
            "network",
            "wan",
            "connection",
            "connectivity",
            "offline",
            "no internet",
            "internet down",
            "internet slow",
            "router light",
            "router lights"
        ],
        "sources": [
            "internet_support.pdf"
        ]
    },

    "billing": {
        "keywords": [
            "bill",
            "billing",
            "invoice",
            "payment",
            "refund",
            "charge",
            "charged",
            "double charge",
            "payment failed",
            "incorrect bill"
        ],
        "sources": [
            "billing_policy.pdf"
        ]
    }
}


# ==========================================================
# Detect Query Domain
# ==========================================================

def detect_domain(message):

    message_lower = message.lower()

    domain_scores = {}

    for domain, config in DOMAIN_RULES.items():

        score = 0

        for keyword in config["keywords"]:

            if keyword in message_lower:
                score += 1

        domain_scores[domain] = score

    print("\nDomain Scores:")
    print(domain_scores)

    if not domain_scores:
        return None

    best_domain = max(
        domain_scores,
        key=domain_scores.get
    )

    if domain_scores[best_domain] == 0:
        return None

    return best_domain


# ==========================================================
# Check Source Against Domain
# ==========================================================

def source_matches_domain(
    source,
    detected_domain
):

    # If domain cannot be detected,
    # allow vector search to decide.
    if detected_domain is None:
        return True

    domain_config = DOMAIN_RULES.get(
        detected_domain
    )

    if not domain_config:
        return True

    allowed_sources = domain_config.get(
        "sources",
        []
    )

    source_lower = source.lower()

    return any(
        allowed_source.lower() == source_lower
        for allowed_source in allowed_sources
    )


# ==========================================================
# Remove Duplicate Results
# ==========================================================

def remove_duplicates(
    documents,
    sources,
    distances
):

    unique_documents = []
    unique_sources = []
    unique_distances = []

    seen = set()

    for document, source, distance in zip(
        documents,
        sources,
        distances
    ):

        key = (
            source,
            document.strip()
        )

        if key in seen:
            continue

        seen.add(key)

        unique_documents.append(
            document
        )

        unique_sources.append(
            source
        )

        unique_distances.append(
            distance
        )

    return (
        unique_documents,
        unique_sources,
        unique_distances
    )


# ==========================================================
# Search Knowledge
# ==========================================================

def search_knowledge(message):

    print("\n" + "=" * 80)
    print("📚 KNOWLEDGE RECOMMENDATION AGENT (RAG)")
    print("=" * 80)

    print("\n📩 Customer Message:")
    print(message)

    try:

        # ==================================================
        # 1. Detect Customer Query Domain
        # ==================================================

        detected_domain = detect_domain(
            message
        )

        print("\nDetected Domain:")
        print(
            detected_domain
            if detected_domain
            else "Unknown"
        )


        # ==================================================
        # 2. Search ChromaDB
        # ==================================================

        results = collection.query(

            query_texts=[
                message
            ],

            n_results=TOP_K,

            include=[
                "documents",
                "metadatas",
                "distances"
            ]
        )


        # ==================================================
        # 3. Extract Results
        # ==================================================

        documents = results.get(
            "documents",
            [[]]
        )[0]

        metadatas = results.get(
            "metadatas",
            [[]]
        )[0]

        distances = results.get(
            "distances",
            [[]]
        )[0]


        # ==================================================
        # 4. No Results
        # ==================================================

        if not documents:

            print(
                "\n⚠ No knowledge found."
            )

            return fallback_knowledge()


        # ==================================================
        # 5. Display Raw Retrieval Results
        # ==================================================

        print("\n" + "=" * 80)
        print("🔎 RAW RETRIEVAL RESULTS")
        print("=" * 80)

        for index, (
            document,
            metadata,
            distance
        ) in enumerate(
            zip(
                documents,
                metadatas,
                distances
            ),
            start=1
        ):

            source = metadata.get(
                "source",
                "Unknown"
            )

            print(
                f"\nResult {index}"
            )

            print(
                "Source   :",
                source
            )

            print(
                "Distance :",
                distance
            )

            print(
                "Document :"
            )

            print(
                document
            )


        # ==================================================
        # 6. Relevance + Domain Filtering
        # ==================================================

        filtered_documents = []
        filtered_sources = []
        filtered_distances = []

        print("\n" + "=" * 80)
        print("🎯 RELEVANCE + DOMAIN FILTERING")
        print("=" * 80)

        for (
            document,
            metadata,
            distance
        ) in zip(
            documents,
            metadatas,
            distances
        ):

            source = metadata.get(
                "source",
                "Unknown"
            )

            distance_ok = (
                distance <= DISTANCE_THRESHOLD
            )

            domain_ok = source_matches_domain(
                source,
                detected_domain
            )

            if not distance_ok:

                print(
                    f"❌ REMOVE | {source} | "
                    f"Distance {distance:.4f} exceeds threshold"
                )

                continue

            if not domain_ok:

                print(
                    f"❌ REMOVE | {source} | "
                    f"Domain mismatch: {detected_domain}"
                )

                continue

            filtered_documents.append(
                document
            )

            filtered_sources.append(
                source
            )

            filtered_distances.append(
                distance
            )

            print(
                f"✅ KEEP | {source} | "
                f"Distance: {distance:.4f}"
            )
        # ==================================================
        # 7. Nothing Relevant Found
        # ==================================================

        if not filtered_documents:

            print(
                "\n⚠ No sufficiently relevant "
                "domain-specific knowledge found."
            )

            return fallback_knowledge()


        # ==================================================
        # 8. Remove Duplicate Results
        # ==================================================

        (
            filtered_documents,
            filtered_sources,
            filtered_distances
        ) = remove_duplicates(
            filtered_documents,
            filtered_sources,
            filtered_distances
        )


        # ==================================================
        # 9. Final RAG Context
        # ==================================================

        print("\n" + "=" * 80)
        print("📚 FINAL RAG CONTEXT")
        print("=" * 80)

        print("\nDetected Domain:")
        print(
            detected_domain
            if detected_domain
            else "Unknown"
        )

        for index, (
            document,
            source,
            distance
        ) in enumerate(
            zip(
                filtered_documents,
                filtered_sources,
                filtered_distances
            ),
            start=1
        ):

            print(
                f"\nChunk {index}"
            )

            print(
                "Source   :",
                source
            )

            print(
                "Distance :",
                distance
            )

            print(
                "Document :"
            )

            print(
                document
            )


        # ==================================================
        # 10. Return Filtered Knowledge
        # ==================================================

        return {

            "topic":
                "Knowledge Recommendation",

            "domain":
                detected_domain or "general",

            "troubleshooting":
                filtered_documents,

            "sources":
                filtered_sources,

            "distances":
                filtered_distances,

            "escalation":
                False
        }


    # ======================================================
    # Error Handling
    # ======================================================

    except Exception as e:

        print("\n" + "=" * 80)
        print("❌ KNOWLEDGE AGENT ERROR")
        print("=" * 80)

        print(
            str(e)
        )

        return fallback_knowledge()


# ==========================================================
# Fallback Knowledge
# ==========================================================

def fallback_knowledge():

    return {

        "topic":
            "General Support",

        "domain":
            "general",

        "troubleshooting": [

            "Collect more information from the customer.",

            "Verify customer account details.",

            "Ask follow-up questions before troubleshooting."
        ],

        "sources":
            [],

        "distances":
            [],

        "escalation":
            False
    }