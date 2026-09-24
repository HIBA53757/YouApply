import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
});

export default db;
try {
    const connection = await db.getConnection();

    console.log("mysql connected successfully");

    connection.release();
} catch (error) {
    console.error("mysql connection failed:", error.message);
}