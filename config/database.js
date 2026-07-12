import mongoose from 'mongoose';

let mongoServer;

export async function connectDB() {
  let uri = process.env.MONGODB_URI;

  if (!uri) {
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    mongoServer = await MongoMemoryServer.create();
    uri = mongoServer.getUri();
    console.log('[db] using memory server');
  }

  await mongoose.connect(uri);
  console.log('[db] connected');
  return uri;
}

export async function disconnectDB() {
  await mongoose.disconnect();
  if (mongoServer) await mongoServer.stop();
}
