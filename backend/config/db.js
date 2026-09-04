import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

// A connection pool is reused across requests instead of opening
// a fresh MySQL connection every time — much faster in practice.
const connectionUri = process.env.MYSQL_URL || process.env.MYSQLURL || process.env.DATABASE_URL;

const pool = connectionUri
  ? mysql.createPool(connectionUri)
  : mysql.createPool({
      host: process.env.DB_HOST || process.env.MYSQLHOST || process.env.MYSQL_HOST || "localhost",
      user: process.env.DB_USER || process.env.MYSQLUSER || process.env.MYSQL_USER || "root",
      password: process.env.DB_PASSWORD || process.env.MYSQLPASSWORD || process.env.MYSQL_PASSWORD || "",
      database: process.env.DB_NAME || process.env.MYSQLDATABASE || process.env.MYSQL_DATABASE || "railway",
      port: Number(process.env.DB_PORT || process.env.MYSQLPORT || process.env.MYSQL_PORT || 3306),
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

export async function initDb() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        profile_pic_url VARCHAR(500) DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("Database initialized: users table is ready.");
  } catch (err) {
    console.error("Failed to initialize database table:", err.message);
  }
}

export default pool;
