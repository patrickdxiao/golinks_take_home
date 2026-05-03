# FastAPI app — game API entrypoint
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import nltk
import random

nltk.download("words", quiet=True)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# filter nltk corpus to valid 5-letter words once at startup
WORDS = [w.lower() for w in nltk.corpus.words.words() if len(w) == 5 and w.isalpha()]
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
