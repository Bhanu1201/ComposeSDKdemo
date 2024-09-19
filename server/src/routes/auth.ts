import { Router, Request, Response } from 'express';
import pool from '../config/db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'; // Add this import
import { RowDataPacket } from 'mysql2';

const router = Router();

const SECRET_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNjYyNjQ5MDYyYTUzNDIwMDJkYTU3ZTBiIiwiYXBpU2VjcmV0IjoiYTViZDc1ZWEtZjZkNC1iZWMzLWU2YzItYzgxMjZlMjI5Mjk1Iiwic3NvVG9rZW4iOm51bGwsImFsbG93ZWRUZW5hbnRzIjpbIjY2MThlMGVkMzlmMGI1MDAxYjFmMGQzMyJdLCJ0ZW5hbnRJZCI6IjY2MThlMGVkMzlmMGI1MDAxYjFmMGQzMyJ9.tk0ft6-U8-NI5eNezGWK0GQ89GqGuCTkvZXfQtrBva8'; // Replace with your actual shared secret
const SSO_URL = 'http://192.168.50.48:30845/'; // Sisense URL

router.post('/authenticate', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    console.log('Received email:', email);
    console.log('Received password:', password);  

    // Query the database for the user with the provided email
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM signup WHERE `Email` = ?',
      [email]
    );

    console.log('Database query result:', rows);

    // If no user is found, send an error response
    if (rows.length === 0) {
      console.log('No user found with the provided email');
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = rows[0] as { Email: string; Password: string };

    console.log('Stored hashed password:', user.Password);

    // Compare the provided password with the stored password hash
    const passwordMatch = await bcrypt.compare(password, user.Password);

    console.log('Password match result:', passwordMatch);

    if (passwordMatch) {
      // Generate JWT token
      const payload = {
        iat: Math.floor(Date.now() / 1000),
        sub: email,
        jti: Math.floor(Date.now() * Math.random()).toString(), // Unique identifier for the JWT
        tenantId: 'your_tenant_id', // Add tenantId if needed
      };

      const token = jwt.sign(payload, SECRET_KEY, { algorithm: 'HS256' });

      // Set a cookie for the user
      res.cookie('dummyUser', email, { httpOnly: true });

      // Send JWT token in response
      return res.status(200).json({ token });
    } else {
      // If the password doesn't match, send an error response
      console.log('Password does not match');
      return res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Error during authentication:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('http://192.168.50.48:30845/app/main/dashboards/669b615677face003324fa62', (req: Request, res: Response) => {
  const email = req.cookies.dummyUser;

  if (!email) {
    return res.redirect('/login'); // Redirect to login if no user found
  }

  // Generate JWT token for Sisense
  const payload = {
    iat: Math.floor(Date.now() / 1000),
    sub: email,
    jti: Math.floor(Date.now() * Math.random()).toString(), // Unique identifier for the JWT
    tenantId: 'your_tenant_id', // Add tenantId if needed
  };

  const token = jwt.sign(payload, SECRET_KEY, { algorithm: 'HS256' });

  const redirectUrl = `${SSO_URL}?jwt=${token}`;

  res.redirect(redirectUrl);
});

export default router;
