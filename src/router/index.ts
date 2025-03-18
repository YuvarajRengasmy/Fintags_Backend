import { Router } from 'express';
const router: Router = Router();

import Company from './company.routes';
import Login from './login.routes';
import File from './fileUpload.routes'
import Register from "./register.routes"
import Website from "./website.routes"

router.use('/company', Company)
router.use('/login', Login)
router.use('/fileUpload', File)
router.use('/register', Register)
router.use('/website', Website)


export default router