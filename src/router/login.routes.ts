import { Router } from 'express';
import { checkRequestBodyParams } from '../middleware/Validators';
import { basicAuthUser } from '../middleware/checkAuth';
import { forgotPassword, loginEmail, updatePassword } from '../controller/login.controller';
const router: Router = Router();

router.post('/',
    basicAuthUser,
    checkRequestBodyParams('email'),
    checkRequestBodyParams('password'),
    loginEmail
);

router.put('/forgotPassword',
    basicAuthUser,
    checkRequestBodyParams('email'),
    checkRequestBodyParams('link'),
    forgotPassword
);

router.put('/updatePassword',
    basicAuthUser,
    checkRequestBodyParams('_id'),
    checkRequestBodyParams('password'),
    updatePassword
);



export default router;