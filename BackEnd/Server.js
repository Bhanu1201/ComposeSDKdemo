import express from 'express';
import jwt from 'jsonwebtoken';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import cors from 'cors';

const app = express();
const port = 3000;

// Get the current directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
console.log(" __dirname", __dirname)

// JWT secret key
const JWT_SECRET = 'your_jwt_secret_key';

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to serve static files
app.use(express.static(join(__dirname, 'pages')));

// CORS Middleware to allow requests from your front-end
app.use(cors({ origin: 'http://localhost:5173' })); // Adjust the origin to match your front-end domain

// Define a route for the login page
app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'public', 'LoginPage.tsx'));
});

// Route to handle login and generate JWT
app.post('/', (req, res) => {
    const { email, firstName, lastName, tenantId } = req.body;

    const issuedAt = Math.floor(Date.now() / 1000);

    const payload = {
        typ: 'JWT',
        alg: 'HS256',
        iat: issuedAt,
        tenantId: tenantId || undefined,
        email: email,
        lastName: lastName || undefined,
        firstName: firstName || undefined,
        jti: `SSOSession_${issuedAt}`,
        exp: issuedAt + (60 * 60), // Token expires in 1 hour
    };

    const token = jwt.sign(payload, JWT_SECRET, { algorithm: 'HS256' });

    const sisenseUrl = `https://dvk.sisense.com/app/account/login?token=${token}`;
    res.redirect(sisenseUrl);
});

// Redirect endpoint (example)
app.get('/redirect', (req, res) => {
    res.redirect('https://dvk.sisense.com/app/main/dashboards/669a4393cc8a6b002ace5d11');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
