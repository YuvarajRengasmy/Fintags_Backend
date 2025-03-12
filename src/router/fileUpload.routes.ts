import {Router} from 'express';
import { addExcelData } from '../controller/fileUpload.controller';
import { checkRequestBodyParams } from '../middleware/Validators';
import { basicAuthUser } from '../middleware/checkAuth';
const router:Router=Router();

router.post('/',
  
  
    addExcelData
);

export default router;