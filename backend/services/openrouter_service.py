import os
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

client = OpenAI(
    api_key=os.getenv("OPENROUTER_API_KEY"),
    base_url="https://openrouter.ai/api/v1"
)


def generate_response(prompt):

    try:

        response = client.chat.completions.create(

            model="google/gemini-2.5-flash",

            temperature=0,

            max_tokens=180,

            messages=[

                {
                    "role": "system",
                    "content": (
                        "You are an AI Customer Support Assistant.\n"
                        "Always follow the user's instructions exactly.\n"
                        "Return only the requested output.\n"
                        "Keep responses concise."
                    )
                },

                {
                    "role": "user",
                    "content": prompt
                }

            ]

        )

        if not response.choices:
            raise Exception("No choices returned from OpenRouter")

        message = response.choices[0].message

        if message is None:
            raise Exception("Message is None")

        if message.content is None:
            raise Exception("Content is None")

        return message.content.strip()

    except Exception as e:

        print("\n================ OPENROUTER ERROR ================\n")
        print(e)
        print("\n==================================================\n")

        return None