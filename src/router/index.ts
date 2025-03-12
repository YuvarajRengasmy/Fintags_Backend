import { Router } from 'express';
const router: Router = Router();

import Company from './company.routes';
import Login from './login.routes';

router.use('/company', Company)
router.use('/login', Login)


export default router