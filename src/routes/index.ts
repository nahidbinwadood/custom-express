import userRoutes from '../modules/users/user.routes';
import { Router } from '../router';

const router = Router();

router.use('/users', userRoutes);

export default router;
