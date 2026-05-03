# FastAPI app — game API entrypoint
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pathlib import Path
import random

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# load the Wordle word list once at startup
WORDS = Path("words.txt").read_text().splitlines()
WORD_SET = set(WORDS)


class GuessRequest(BaseModel):
    word: str
    guess: str


@app.get("/")
def root():
    return {"status": "ok"}


# return a random 5-letter word
@app.get("/word")
def get_word():
    return {"word": random.choice(WORDS)}


# score each letter: green, yellow, or gray — rejects invalid words
@app.post("/guess")
def check_guess(body: GuessRequest):
    word = body.word.lower()
    guess = body.guess.lower()
    if guess not in WORD_SET:
        raise HTTPException(status_code=400, detail="invalid word")
    result = ["gray"] * 5
    word_letters = list(word)

    for i in range(5):
        if guess[i] == word[i]:
            result[i] = "green"
            word_letters[i] = None

    for i in range(5):
        if result[i] == "green":
            continue
        if guess[i] in word_letters:
            result[i] = "yellow"
            word_letters[word_letters.index(guess[i])] = None

    return {"result": result}
