import mongoose from "mongoose";

async function connectMongoDB(URL) {
  return mongoose.connect(URL);
}

export { connectMongoDB };
//
