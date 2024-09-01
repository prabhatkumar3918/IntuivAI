from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import os

# Replace these with your actual credentials or load them from environment variables
uri = os.getenv("MONGO_URI", "mongodb+srv://dangerousdan:poison3399@atlascluster.4a6wz.mongodb.net/?retryWrites=true&w=majority&appName=AtlasCluster")

# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'))

# Send a ping to confirm a successful connection
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(f"Failed to connect to MongoDB: {e}")

# # Access your database and collection
# database = client.get_database("your_database_name")
# users_collection = database.get_collection("users")
