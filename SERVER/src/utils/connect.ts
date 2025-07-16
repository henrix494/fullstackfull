import mongoose from "mongoose";

export default async function connectToDatabase() {
  try {
    await mongoose.connect(
      "mongodb+srv://henrix494:134679852Aaa@cluster0.x6qbp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    );
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}
