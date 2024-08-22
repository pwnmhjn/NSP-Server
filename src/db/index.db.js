import mongoose from 'mongoose';
import { mongoDatabaseName } from '../constants.js';

const mongoDB = async () => {
  try {
    const mongoInstance = await mongoose.connect(
      `${process.env.MONGO_URL}/${mongoDatabaseName}`
    );
    console.log(`mongoDb connected Db host: ${mongoInstance.connection.host}`);
  } catch (err) {
    console.log(`Error While Connecting to mongoDb ${err}`);
  }
};

export { mongoDB };
