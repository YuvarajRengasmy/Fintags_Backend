import {Router} from 'express';
import { addExcelData,getAllExcelData,createContact,getSingleUpload,updateCompany,getFilteredContact,deleteFile } from '../controller/fileUpload.controller';
import { checkRequestBodyParams,checkQuery } from '../middleware/Validators';
import { checkSession ,} from '../utils/tokenManager';
import { basicAuthUser } from '../middleware/checkAuth';
const router:Router=Router();

router.post('/',
  
   
    addExcelData
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

router.delete('/',
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    deleteFile
);


router.put('/getFilterFile',
    basicAuthUser,
    checkSession,
    getFilteredContact,
);

export default router;