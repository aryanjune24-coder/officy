import mongoose from "mongoose";

const MONGODB_URI =
  "mongodb+srv://officyadmin:XRYXX9UhOOgln4YL@cluster0.b8aeu3s.mongodb.net/?appName=Cluster0";

if (!MONGODB_URI) {
  throw new Error("MongoDB URI missing");
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = {
    conn: null,
    promise: null,
  };
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(
      MONGODB_URI
    );
  }

  cached.conn = await cached.promise;
  return cached.conn;
}