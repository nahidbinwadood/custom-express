import { Router } from '../../express/core/router';
import userRoutes from '../modules/users/user.routes';

const router = Router();

router.use('/users', userRoutes);

export default router;
