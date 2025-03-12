import * as jwt from 'jsonwebtoken';
import { response } from '../helper/commonResponseHandler';
import { clientError, errorMessage } from '../helper/ErrorMessage';
const activity = 'token';

/**
 * @author Ponjothi S
 * @date 07-09-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to token creation
 */

export let CreateJWTToken = (data: any = {}) => {
    let tokenData = {};
    if (data && data['companyName']) {
        tokenData['companyName'] = data['companyName']
    }
    if (data && data['companyId']) {
        tokenData['companyId'] = data['companyId']
    }
  
    const token = jwt.sign(tokenData, 'pixaliveworks', { expiresIn: '8h' });
    return token;
}



/**
 * @author Ponjothi S
 * @date 07-09-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to Chech the session and Verify the token
 */
export let checkSession = async (req, res, next) => {
    const token = req.headers['token'];
    if (token) {
        const headerType = token.split(' ')[0];
        const tokenValue = token.split(' ')[1].trim();
        if (headerType.trim() === "Bearer") {
            try {
                jwt.verify(tokenValue, 'pixalive', function (err, tokendata) {
                    if (err) {
                        return res.status(400).json({ message: clientError.token.sessionExpire })
                    }
                    if (tokendata) {
                        console.log('tokendata',tokendata);
                        req.body.loginId = tokendata.userId;
                        req.body.loginUserName = tokendata.userName;
                        req.body.createdBy = tokendata.userName;
                        req.body.createdOn = new Date();
                        req.body.modifiedBy = tokendata.userName;
                        req.body.modifiedOn = new Date();
                        next();
                    }
                });
            } catch (err: any) {
                return response(req, res, activity, 'Check-Session','Level-3',  false, 499, {}, clientError.token.unauthRoute, err.message);
            }
        }
    } else {
        return response(req, res, activity, 'Check-Session','Level-3',  false, 499, {}, clientError.token.unauthRoute);
    }
}
