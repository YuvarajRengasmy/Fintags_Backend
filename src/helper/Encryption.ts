import * as crypto from "crypto";
import * as Config from "../config/Enviornment";
import * as CryptoJS from "crypto-js";

let password = "";
let confirmPassword = ""
let conversionOutput: string;

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

export let encrypt = (textToConvert) => {

  return (conversionOutput = CryptoJS.AES.encrypt(textToConvert.trim(), password.trim()).toString());
};

/**
 * @author Balan K K
 * @date  01-05-2024
 * @description This function return encrypted item for given string using cryptojs
 * @param {String} text
 */
export let decrypt = (textToConvert) => {

  return (conversionOutput = CryptoJS.AES.decrypt(textToConvert.trim(), password.trim()).toString(CryptoJS.enc.Utf8));
};