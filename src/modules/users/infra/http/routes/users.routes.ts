import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import uploadConfig from '@config/upload';
import UsersController from '../controllers/UsersController';
import isAuthenticated from '@shared/infra/http/middlewares/isAuthenticated';
import UsersAvatarController from '../controllers/UsersAvatarController';

const userRouter = Router();
const usersController = new UsersController();
const usersAvatarController = new UsersAvatarController();

userRouter.get('/', isAuthenticated, usersController.index);

userRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },
  }),
  usersController.create,
);

userRouter.patch(
  '/avatar',
  isAuthenticated,
  uploadConfig.multer.single('avatar'),
  usersAvatarController.update,
);

export default userRouter;
