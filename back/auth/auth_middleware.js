import dotenv from 'dotenv';
dotenv.config();
import jwt from 'jsonwebtoken';


export function requireAuth(req, res, next) {

  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      error: 'Missing authorization token'
    });
  }

  try {

    req.user = jwt.verify(token,process.env.JWT_SECRET);

    return next();

  } catch (error) {

    return res.status(401).json({

      error: 'Invalid authorization token'

    });
  }
}
