import * as dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const mongoConfig = async () => {
  if (!process.env.MONGO_DB) {
    throw new Error('MONGO_DB environment variable not set');
  }

  try {
    await mongoose.connect(process.env.MONGO_DB);
  } catch (error) {
    console.error.bind(console, 'Mongo connection error');
  }
};

export default mongoConfig;
