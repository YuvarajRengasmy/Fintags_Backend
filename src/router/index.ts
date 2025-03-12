import { Router } from 'express';
const router: Router = Router();

import Company from './company.routes';
import Login from './login.routes';
import File from './fileUpload.routes'

router.use('/company', Company)
router.use('/login', Login)
router.use('/fileUpload', File)


export default router