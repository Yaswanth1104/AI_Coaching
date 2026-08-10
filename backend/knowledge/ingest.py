from pathlib import Path

import chromadb
from chromadb.utils import embedding_functions
from pypdf import PdfReader


# ==========================================================
# Paths
# ==========================================================

BASE_DIR = Path(__file__).parent

PDF_DIR = BASE_DIR / "pdfs"

CHROMA_DIR = BASE_DIR / "chroma_db"


# ==========================================================
# ChromaDB
# ==========================================================

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
# Read PDF
# ==========================================================

def read_pdf(pdf_path):

    reader = PdfReader(pdf_path)

    text = ""

    for page in reader.pages:

        page_text = page.extract_text()

        if page_text:

            text += page_text + "\n"

    return text.strip()


# ==========================================================
# Chunk Text With Overlap
# ==========================================================

def chunk_text(
    text,
    chunk_size=500,
    chunk_overlap=100
):

    chunks = []

    # Safety check
    if not text:
        return chunks

    if chunk_overlap >= chunk_size:
        raise ValueError(
            "chunk_overlap must be smaller than chunk_size."
        )

    start = 0

    while start < len(text):

        end = start + chunk_size

        chunk = text[start:end].strip()

        if chunk:

            chunks.append(chunk)

        # Move forward while keeping overlap
        start += chunk_size - chunk_overlap

    return chunks


# ==========================================================
# Build ChromaDB
# ==========================================================

def build_database():

    pdf_files = list(
        PDF_DIR.glob("*.pdf")
    )

    if len(pdf_files) == 0:

        print("\nNo PDF files found.")

        return

    print("\n" + "=" * 80)
    print("BUILDING KNOWLEDGE BASE")
    print("=" * 80)

    doc_id = 0

    # ======================================================
    # Process PDFs
    # ======================================================

    for pdf in pdf_files:

        print(f"\nReading: {pdf.name}")

        # --------------------------------------------------
        # Extract PDF text
        # --------------------------------------------------

        text = read_pdf(pdf)

        if not text:

            print(
                f"No text found in {pdf.name}. Skipping."
            )

            continue

        # --------------------------------------------------
        # Create chunks
        # --------------------------------------------------

        chunks = chunk_text(
            text,
            chunk_size=500,
            chunk_overlap=100
        )

        print(
            f"Chunks created: {len(chunks)}"
        )

        # --------------------------------------------------
        # Store chunks in ChromaDB
        # --------------------------------------------------

        for chunk_index, chunk in enumerate(chunks):

            chunk_id = (
                f"{pdf.stem}_chunk_{chunk_index}"
            )

            collection.upsert(

                documents=[
                    chunk
                ],

                ids=[
                    chunk_id
                ],

                metadatas=[
                    {
                        "source": pdf.name,
                        "chunk_id": chunk_index
                    }
                ]
            )

            doc_id += 1

            print(
                f"Stored: {chunk_id}"
            )

    # ======================================================
    # Completed
    # ======================================================

    print("\n" + "=" * 80)
    print("KNOWLEDGE BASE CREATED SUCCESSFULLY")
    print("=" * 80)

    print(
        f"Total chunks stored: {doc_id}"
    )

    print("=" * 80)


# ==========================================================
# Main
# ==========================================================

if __name__ == "__main__":

    build_database()