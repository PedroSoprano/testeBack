import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

const secretKey = 'seu_secret_key_aqui'; 

export function authenticateToken(req: Request | any, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authorization token not found' });
  }

  jwt.verify(token, secretKey, (err: any, decoded: any) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }

    req.user = decoded;

    next();
  });
}
