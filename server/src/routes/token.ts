// src/routes/token.ts

import { Router, Request, Response } from 'express';
import { getToken } from './wat_sample';

const router = Router();

router.post('/token', async (req: Request, res: Response) => {
    try {
        const token = await getToken();
        res.json({ token });
    } catch (err) {
        console.error('Error generating token:', err);
        res.status(500).json({ error: 'Failed to generate token' });
    }
});

export default router;
