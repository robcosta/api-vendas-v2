import 'reflect-metadata'; //Usado pelo typeorm é necessita ser a primeira importação
import express, { NextFunction, Request, Response } from 'express';
import 'express-async-errors';
import cors from 'cors';
import { errors } from 'celebrate';
import { MulterError } from 'multer';
import routes from './routes/index';
import AppError from '@shared/errors/AppError';
import '@shared/typeorm'; //'@shared/typeorm/index.ts'->como  arquivo é index.ts não precisa do nome
import path from 'path';

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);
app.use(errors()); //Possíveis erros gerados na validação dos dados do usuário
app.use(
  '/files',
  express.static(path.resolve(__dirname, '..', '..', '..', 'uploads')),
);
app.use(
  (error: Error, request: Request, response: Response, next: NextFunction) => {
    if (error instanceof AppError) {
      return response.status(error.statusCode).json({
        status: 'error',
        message: error.message,
      });
    }
    if (error instanceof MulterError) {
      return response.status(401).json({
        status: 'error',
        message: error.code,
      });
    }
    return response.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  },
);

app.listen(3333, () => {
  console.log('Server started on port 3333! 🙌');
});
