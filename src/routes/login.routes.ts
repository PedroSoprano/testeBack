import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client'; 
import { Router } from 'express';
import { User } from '../interfaces/user';
var bcrypt = require('bcryptjs');
import * as jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
export const loginRoutes = Router();

const secretKey = 'seu_secret_key_aqui'; 

loginRoutes.post('/', async (req: Request, res: Response) => {
    const { login, password } = req.body;

    const user: User | null = await prisma.user.findUnique({
      where: { login },
    });
  
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
  
    const passwordMatch = await bcrypt.compare(password, user.password);
  
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
  
    const tokenPayload = { name: user.name };
    const token = jwt.sign(tokenPayload, secretKey, { expiresIn: '1h' });
  
    res.json({ token: token, user: user.name });
});

