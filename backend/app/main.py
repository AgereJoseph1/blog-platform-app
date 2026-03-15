from fastapi import FastAPI

app = FastAPI(title="Blog Platform API")


@app.get("/health")
async def health_check():
    return {"status": "ok"}
