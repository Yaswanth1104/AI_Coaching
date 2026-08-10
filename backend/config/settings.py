import os

class Config:

    HOST = "0.0.0.0"

    PORT = 5000

    DEBUG = True

    OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")