import { validationResult } from "express-validator";
import { clientError, errorMessage } from "../helper/ErrorMessage";
import { response } from "../helper/commonResponseHandler";
import { Company, CompanyDocument } from "../model/company.model";
import * as TokenManager from "../utils/tokenManager";

import { decrypt, encrypt,hashPassword } from "../helper/Encryption";


var activity = "Company"


// export let saveCompany = async (req, res, next) => {
//     const errors = validationResult(req);
//     if (errors.isEmpty()) {
//         try {
//             const companyData = await Company.findOne({ $and: [{ isDeleted: false }, { email: req.body.email }] });
//             if (!companyData) {
//                 req.body.password = await hashPassword(req.body.password)
//                 const companyDetails: CompanyDocument = req.body;
//                 const createData = new Company(companyDetails);
//                 let insertData = await createData.save();
//                 const token = await TokenManager.CreateJWTToken({
//                     id: insertData["_id"],
//                     name: insertData["name"],
//                     loginType: 'admin'
//                 });
//                 const result = {}
//                 result['_id'] = insertData._id
//                 result['name'] = insertData.name;
//                 let finalResult = {};
//                 finalResult["loginType"] = 'student';
//                 finalResult["companyDetails"] = result;
//                 finalResult["token"] = token;
//                 response(req, res, activity, 'Level-2', 'Save-Company', true, 200, result, clientError.success.registerSuccessfully);
//             }
//             else {
//                 response(req, res, activity, 'Level-3', 'Save-Company', true, 422, {}, 'Email already registered');
//             }

//         } catch (err: any) {
//             response(req, res, activity, 'Level-3', 'Save-Company', false, 500, {}, errorMessage.internalServer, err.message);
//         }
//     } else {
//         response(req, res, activity, 'Level-3', 'Save-Company', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
//     }
// };

export let saveCompany = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const admin = await Company.findOne({ $and: [{ isDeleted: false }, { email: req.body.email }] });

            if (!admin) {
                req.body.password = await hashPassword(req.body.password)
                req.body.confirmPassword = await hashPassword(req.body.confirmPassword)

                const adminDetails: CompanyDocument = req.body;
              
                const createData = new Company(adminDetails);
                let insertData = await createData.save();
            
                const token = await TokenManager.CreateJWTToken({
                    id: insertData["_id"],
                    name: insertData["name"],
                    loginType: 'admin'
                });
                const result = {}
                result['_id'] = insertData._id
                result['email'] = insertData.email;
                let finalResult = {};
                finalResult["token"] = token;
                finalResult["loginType"] = 'company';
                finalResult["companyDetails"] = result;
                response(req, res, activity, 'Level-1', 'Create-Admin', true, 200, finalResult, clientError.success.registerSuccessfully);
            }
            else {
                response(req, res, activity, 'Level-2', 'Create-Admin', true, 422, {}, 'Email already registered');
            }

        } catch (err: any) {

            response(req, res, activity, 'Level-3', 'Create-Admin', false, 500, {}, errorMessage.internalServer, err.message);
        }
    }
    else {
        response(req, res, activity, 'Level-3', 'Create-Admin', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}