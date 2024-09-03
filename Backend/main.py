from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from motor.motor_asyncio import AsyncIOMotorClient
import os
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from pymongo.collection import Collection
from pymongo.database import Database
from dotenv import load_dotenv
import urllib.parse


app = FastAPI()

load_dotenv()

# MongoDB connection
username = urllib.parse.quote_plus("sidhartha")
password = urllib.parse.quote_plus("Sid@9392548369")
host = "datacollection.fue67.mongodb.net"
params = "?retryWrites=true&w=majority&appName=DataCollection"
connection_string = f"mongodb+srv://{username}:{password}@{host}/{params}"

mongo_client: MongoClient = MongoClient(connection_string)

database: Database = mongo_client.get_database("nocaptcha-database")
collection: Collection = database.get_collection("Data")



# Pydantic model for the incoming data
class InteractionData(BaseModel):
    interactionData: dict
    features: dict
    sessionDuration: int
    userAgent: str
    screenResolution: str
    connectionType: str
    connectionStability: str
    ipAddress: str
    geolocation: str
    deviceOrientation: dict
    deviceMotion: dict

origins = [
    "http://localhost:5173"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/submit-data/")
async def submit_data(data: InteractionData):
    try:
        print(data.dict())
        result = await collection.insert_one(data.dict())
        return {"message": "Data stored successfully", "id": str(result.inserted_id)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Run the application
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)