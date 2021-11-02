import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import { uploadMulter } from '@config/upload';
import UsersController from '../controllers/UsersController';
import isAuthenticated from '@shared/http/middlewares/isAuthenticated';
import UsersAvatarController from '../controllers/UsersAvatarController';

const userRouter = Router();
const usersController = new UsersController();
const usersAvatarController = new UsersAvatarController();

//const upload = multer(uploadConfig);

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
  uploadMulter.single('avatar'),
  usersAvatarController.update,
);

export default userRouter;
