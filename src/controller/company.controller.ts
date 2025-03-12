import { validationResult } from "express-validator";
import { clientError, errorMessage } from "../helper/ErrorMessage";
import { response } from "../helper/commonResponseHandler";
import { Company, CompanyDocument } from "../model/company.model";
import * as TokenManager from "../utils/tokenManager";
import { hashPassword } from "../helper/Encryption";

var activity = "Company"


export let saveCompany = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const companyData = await Company.findOne({ $and: [{ isDeleted: false }, { email: req.body.email }] });
            if (!companyData) {
                req.body.password = await hashPassword(req.body.password)
                const companyDetails: CompanyDocument = req.body;
                const createData = new Company(companyDetails);
                let insertData = await createData.save();
                const token = await TokenManager.CreateJWTToken({
                    companyId: insertData["_id"],
                    companyName: insertData["name"],
                });
                const result = {}
                result['_id'] = insertData._id
                result['companyName'] = insertData.name;
                let finalResult = {};
                finalResult["loginType"] = 'company';
                finalResult["companyDetails"] = result;
                finalResult["token"] = token;
                response(req, res, activity, 'Level-2', 'Save-Company', true, 200, result, clientError.success.registerSuccessfully);
            }
            else {
                response(req, res, activity, 'Level-3', 'Save-Company', true, 422, {}, 'Email already registered');
            }

        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Save-Company', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Save-Company', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};