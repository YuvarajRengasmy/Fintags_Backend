import { validationResult } from "express-validator";
import { clientError, errorMessage } from "../helper/ErrorMessage";
import { response } from "../helper/commonResponseHandler";
import { File, FileDocument } from "../model/FileUpload.model";
import * as TokenManager from "../utils/tokenManager";
import { hashPassword } from "../helper/Encryption";

const activity = "File";

// Add Excel data to the database
export const addExcelData = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const data = req.body;
    await File.insertMany(data);
    return res.status(201).json({ success: true, message: 'Data successfully saved to the database!' });
  } catch (error) {
    console.error('Error saving data:', error);
    return res.status(500).json({ success: false, message: 'Error saving data to the database.', error: error.message });
  }
};

// Get all Excel data from the database
export const getAllExcelData = async (req, res) => {
  try {
    const data = await File.find();
    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error retrieving data:', error);
    return res.status(500).json({ success: false, message: 'Error retrieving data from the database.', error: error.message });
  }
};
