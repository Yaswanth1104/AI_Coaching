import os

from dotenv import load_dotenv
from openai import OpenAI


# ==========================================================
# LOAD ENVIRONMENT VARIABLES
# ==========================================================

load_dotenv()


# ==========================================================
# OPENROUTER API KEY
# ==========================================================

api_key = os.getenv("OPENROUTER_API_KEY")

if not api_key:
    raise ValueError(
        "OPENROUTER_API_KEY is not set in .env"
    )


# ==========================================================
# OPENROUTER CLIENT
# ==========================================================

client = OpenAI(
    api_key=api_key,
    base_url="https://openrouter.ai/api/v1"
)


# ==========================================================
# MODEL
# ==========================================================

MODEL = "openai/gpt-oss-20b:free"


# ==========================================================
# GENERATE AI RESPONSE
# ==========================================================

def generate_response(prompt):

    print("\n" + "=" * 80)
    print("OPENROUTER REQUEST")
    print("=" * 80)

    print("\nModel:")
    print(MODEL)

    print("\nPrompt:")
    print(prompt[:2000])

    try:

        response = client.chat.completions.create(
            model=MODEL,

            temperature=0,

            # Give the reasoning model enough space
            max_tokens=500,

            # OpenRouter-specific reasoning configuration
            extra_body={
                "reasoning": {
                    "effort": "low"
                }
            },

            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are an AI Customer Support Assistant.\n"
                        "Follow the user's instructions exactly.\n"
                        "Do not reveal your reasoning or thinking process.\n"
                        "Return only the requested final answer.\n"
                        "If JSON is requested, return ONLY valid JSON.\n"
                        "Do not use markdown.\n"
                        "Do not use code blocks."
                    )
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )

        # ==================================================
        # RAW RESPONSE
        # ==================================================

        print("\nOPENROUTER RAW RESPONSE:")
        print(response)


        # ==================================================
        # VALIDATE RESPONSE
        # ==================================================

        if not response.choices:
            raise Exception(
                "OpenRouter returned no choices."
            )


        # ==================================================
        # MESSAGE
        # ==================================================

        message = response.choices[0].message

        print("\nMESSAGE OBJECT:")
        print(message)


        # ==================================================
        # CONTENT
        # ==================================================

        content = message.content

        print("\nMESSAGE CONTENT:")
        print(content)


        # ==================================================
        # FINISH REASON
        # ==================================================

        finish_reason = getattr(
            response.choices[0],
            "finish_reason",
            None
        )

        print("\nFINISH REASON:")
        print(finish_reason)


        # ==================================================
        # USAGE
        # ==================================================

        usage = getattr(
            response,
            "usage",
            None
        )

        print("\nUSAGE:")
        print(usage)


        # ==================================================
        # CONTENT VALIDATION
        # ==================================================

        if content is None:

            raise Exception(
                "OpenRouter returned None content. "
                f"Finish reason: {finish_reason}"
            )


        result = content.strip()


        if not result:

            raise Exception(
                "OpenRouter returned empty content."
            )


        # ==================================================
        # SUCCESS
        # ==================================================

        print("\n" + "=" * 80)
        print("OPENROUTER RESPONSE SUCCESS")
        print("=" * 80)

        print("\nModel Used:")

        print(
            getattr(
                response,
                "model",
                MODEL
            )
        )

        print("\nFinal Result:")

        print(result)

        print("\n" + "=" * 80)

        return result


    # ======================================================
    # ERROR HANDLING
    # ======================================================

    except Exception as e:

        print("\n" + "=" * 80)
        print("OPENROUTER ERROR")
        print("=" * 80)

        print("\nError Type:")
        print(type(e).__name__)

        print("\nError Message:")
        print(str(e))

        print("\n" + "=" * 80)

        raise