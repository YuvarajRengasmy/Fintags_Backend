import { validationResult } from "express-validator";
import { hashPassword } from "../helper/Encryption";
import { clientError, errorMessage } from "../helper/ErrorMessage";
import { response, sendEmail } from "../helper/commonResponseHandler";
import { Company } from "../model/company.model";
import * as TokenManager from "../utils/tokenManager";


var activity = "Login"

/**
 * @author Ponjothi S
 * @date 07-09-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is Login
 */
export let loginEmail = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            let { email, password } = req.body;
            const result = await Company.findOne({ $and: [{ email: email }, { isDeleted: false }] }, { name: 1, email: 1, password: 1, mobile: 1, isDeleted: 1, status: 1 })
            if (result) {
                const newHash = await hashPassword(password);
                if (result["status"] === 2) {
                    response(req, res, activity, 'Level-3', 'Login-Email', false, 499, {}, clientError.account.inActive);
                } else if (newHash != result["password"]) {
                    response(req, res, activity, 'Level-3', 'Login-Email', false, 403, {}, "Invalid Password !");
                } else {
                    const token = await TokenManager.CreateJWTToken({
                        companyId: result["_id"],
                        companyName: result["name"],
                        loginType: 'company'
                    });
                    const details = {}
                    details['_id'] = result._id
                    details['companyName'] = result.name;
                    let finalResult = {};
                    finalResult["loginType"] = 'company';
                    finalResult["companyDetails"] = details;
                    finalResult["token"] = token;
                    response(req, res, activity, 'Level-2', 'Login-Email', true, 200, result, clientError.success.loginSuccess);
                }
            }
            else {
                response(req, res, activity, 'Level-3', 'Login-Email', true, 422, {}, 'Invalid otp');
            }
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Login-Email', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
        }
    }
};


/**
 * @author Ponjothi S
 * @date 07-09-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used for Forget Password.
 */
export let forgotPassword = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            let data = await Company.findOne({ email: req.body.email })
            var _id = data._id
            if (data) {
                sendEmail(req, req.body.email, 'Reset Password', req.body.link + _id)
                    .then(doc => {
                        response(req, res, activity, 'Level-2', 'Forgot-Password', true, 200, doc, clientError.email.emailSend)
                        return doc;
                    })
                    .catch(error => {
                        console.error(error)
                    })
            }
            else {
                response(req, res, activity, 'Level-3', 'Forgot-Password', true, 200, data, clientError.user.userDontExist);
            }
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Forgot-Password', false, 500, {}, errorMessage.internalServer, err.message);
        }
    }
}




/**
 * @author Ponjothi S
 * @date 07-09-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used for Update Password.
 */
export let updatePassword = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            let { modifiedOn, modifiedBy } = req.body
            let id = req.body._id
            req.body.password = await hashPassword(req.body.password);
            const data = await Company.findByIdAndUpdate({ _id: id }, {
                $set: {
                    password: req.body.password,
                    modifiedOn: modifiedOn,
                    modifiedBy: modifiedBy
                }
            });
            response(req, res, activity, 'Level-2', 'Update-Password', true, 200, data, clientError.success.updateSuccess)
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Update-Password', true, 500, {}, errorMessage.internalServer, err.message)
        }
    } else {
        response(req, res, activity, 'Level-3', 'Update-Password', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()))
    }
}

