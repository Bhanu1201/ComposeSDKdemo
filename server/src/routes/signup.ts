import { Router, Request, Response } from 'express';
import pool from '../config/db';
import bcrypt from 'bcrypt';
import { RowDataPacket } from 'mysql2';

const router = Router();

router.post('/signup', async (req: Request, res: Response) => {
  const { username, email, phone, password } = req.body;

  try {
    // Check if the email or phone number already exists
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM signup WHERE Email = ? OR PhoneNumber = ?',
      [email, phone]
    );

    if (rows.length > 0) {
      // If email or phone number exists, send an error response
      return res.status(400).json({ message: 'Email or phone number already exists' });
    }

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    await pool.query(
      'INSERT INTO signup (UserName, Email, PhoneNumber, Password) VALUES (?, ?, ?, ?)',
      [username, email, phone, hashedPassword]
    );

    res.status(200).json({ message: 'Signup successful' });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
