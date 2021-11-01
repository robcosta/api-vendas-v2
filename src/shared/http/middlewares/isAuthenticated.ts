import AppError from '@shared/errors/AppError';
import { verify } from 'jsonwebtoken';
import authConfig from '@config/auth';
import { NextFunction, Response, Request } from 'express';

interface ITokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

export default function isAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError('JWT Token is issing.');
  }
  //Composição do token enviado: Bearer token. Bearer não é necessário
  const [, token] = authHeader.split(' ');

  try {
    const decodedToken = verify(token, authConfig.jwt.secret);
    const { sub } = decodedToken as ITokenPayload;
    //Overide request
    request.user = {
      id: sub,
    };

    return next();
  } catch (error) {
    throw new AppError('Invalid JWT Token.');
  }
}
