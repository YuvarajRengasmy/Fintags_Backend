import {Router} from 'express';
import { addExcelData,createWebsite,getSingleWebsite,updateWebsite,getFilteredWebsite, getAllWebsite} from '../controller/website.controller';
import { checkRequestBodyParams,checkQuery } from '../middleware/Validators';
import { checkSession ,} from '../utils/tokenManager';
import { basicAuthUser } from '../middleware/checkAuth';
const router:Router=Router();

router.post('/',
  
   
    getAllWebsite
);

router.post('/create',
    basicAuthUser,
    checkSession,
    createWebsite
);
router.get("/",
    basicAuthUser, 
    checkSession,  
    getAllWebsite
)
router.get('/getSingleUpload',
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    getSingleWebsite,
);

router.put('/',
    basicAuthUser,
    checkSession,
     checkRequestBodyParams('_id'),
     updateWebsite
);




router.put('/getFilterFile',
    basicAuthUser,
    checkSession,
    getFilteredWebsite,
);

export default router;