import * as crypto from "crypto";
import * as Config from "../config/Enviornment";


/**
 * @author Ponjothi S  
 * @date  07-09-2023
 * @description This function return password encryption.
 * @param {String} text
 */
export let hashPassword = async (text) => {
  return await new Promise((resolve, reject) => {
    const hash = crypto.createHmac("sha256", Config.SERVER.SALT);
    hash.update(text.toString());
    resolve(hash.digest("hex"));
  });
};
