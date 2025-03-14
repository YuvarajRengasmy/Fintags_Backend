import {Router} from 'express';
import { addExcelData,getAllExcelData,createContact,getSingleUpload,updateCompany,getFilteredContact, getAllRegister} from '../controller/register.controller';
import { checkRequestBodyParams,checkQuery } from '../middleware/Validators';
import { checkSession ,} from '../utils/tokenManager';
import { basicAuthUser } from '../middleware/checkAuth';
const router:Router=Router();

router.post('/',
  
   
    getAllRegister
);

router.post('/create',
    basicAuthUser,
    checkSession,
    createContact
);
router.get("/",
    basicAuthUser, 
    checkSession,  
    getAllExcelData
)
router.get('/getSingleUpload',
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    getSingleUpload,
);

router.put('/',
    basicAuthUser,
    checkSession,
     checkRequestBodyParams('_id'),
     updateCompany
);




router.put('/getFilterFile',
    basicAuthUser,
    checkSession,
    getFilteredContact,
);

export default router;