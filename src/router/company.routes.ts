import {Router} from 'express';
import { saveCompany } from '../controller/company.controller';
import { checkRequestBodyParams } from '../middleware/Validators';
import { basicAuthUser } from '../middleware/checkAuth';
const router:Router=Router();

router.post('/',
    basicAuthUser,
    checkRequestBodyParams('email'),
    checkRequestBodyParams('password'),
    saveCompany
);

export default router;