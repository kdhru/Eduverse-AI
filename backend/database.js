import { MongoClient, ObjectId } from "mongodb";

let client;
let tutorResponses;
let connectionPromise;

export async function connectDatabase() {
  if (tutorResponses) {
    return tutorResponses;
  }

  if (connectionPromise) {
    return connectionPromise;
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is missing from backend/.env.");
  }

  client = new MongoClient(uri, { serverSelectionTimeoutMS: 10000 });
  connectionPromise = client.connect()
    .then(async (connectedClient) => {
      const databaseName = process.env.MONGODB_DATABASE || "edumind";
      const database = connectedClient.db(databaseName);
      await database.command({ ping: 1 });
      tutorResponses = database.collection("tutor_responses");
      console.log(`Connected to MongoDB database "${databaseName}".`);
      return tutorResponses;
    })
    .catch(async (error) => {
      try {
        await client?.close();
      } catch (closeError) {
        console.error("Unable to close MongoDB after a connection failure:", closeError);
      }
      client = undefined;
      connectionPromise = undefined;
      throw error;
    });
  return connectionPromise;
}

export async function saveTutorResponse(document) {
  const collection = await connectDatabase();
  return collection.insertOne(document);
}

export async function listTutorConversations() {
  const collection = await connectDatabase();
  return collection.aggregate([
    {
      $addFields: {
        conversationKey: {
          $ifNull: ["$conversationId", { $toString: "$_id" }],
        },
      },
    },
    { $sort: { createdAt: -1 } },
    {
      $group: {
        _id: "$conversationKey",
        title: { $last: "$prompt" },
        updatedAt: { $first: "$createdAt" },
        messageCount: { $sum: 1 },
      },
    },
    { $sort: { updatedAt: -1 } },
    { $limit: 50 },
    { $project: { _id: 0, id: "$_id", title: 1, updatedAt: 1, messageCount: 1 } },
  ]).toArray();
}

export async function getTutorConversation(conversationId) {
  const collection = await connectDatabase();
  const conditions = [{ conversationId }];

  if (ObjectId.isValid(conversationId)) {
    conditions.push({ _id: new ObjectId(conversationId) });
  }

  return collection.find(
    { $or: conditions },
    { projection: { prompt: 1, response: 1, createdAt: 1 } },
  ).sort({ createdAt: 1 }).limit(500).toArray();
}
