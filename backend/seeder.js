import mongoose from 'mongoose';
import dotenv from 'dotenv';
import users from './data/users.js'; // We Will Create This Next
import User from './models/userModel.js';
import connectDB from './config/db.js';

dotenv.config();

connectDB();

const importData = async () => {
    try {
        // Clear Old Data
        await User.deleteMany();

        // Insert New Admin User
        // Note: The Password Will Be Hashed Automatically By Your Model
        const createdUsers = await User.insertMany(users);

        console.log('Data Imported Successfully!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await User.deleteMany();
        console.log('Data Destroyed!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}