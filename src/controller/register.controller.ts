import { validationResult } from "express-validator";
import { clientError, errorMessage } from "../helper/ErrorMessage";
import { response } from "../helper/commonResponseHandler";
import { Register, RegisterDocument } from "../model/register.model";
import * as TokenManager from "../utils/tokenManager";
import { hashPassword } from "../helper/Encryption";
import axios from 'axios';

const activity = "Register";

// Add Excel data to the database
export const addExcelData = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const data = req.body;
    await Register.insertMany(data);
    return res.status(201).json({ success: true, message: 'Data successfully saved to the database!' });
  } catch (error) {
    console.error('Error saving data:', error);
    return res.status(500).json({ success: false, message: 'Error saving data to the database.', error: error.message });
  }
};

export const getAllRegister = async (req, res) => {
    const data = req.body; // Expecting an array of objects
  
    // If the data array is empty, return a 400 error
    if (!Array.isArray(data) || data.length === 0) {
      return res.status(400).json({ success: false, message: "No data provided or data is invalid" });
    }
  
    try {
      const updatedRegisters = [];
      const registersToSave = [];
  
      // Process each entry in the data array
      for (let i = 0; i < data.length; i++) {
        const {
          _id,
          company_name = '',  
          registrationNumber = '', 
          business_category = '', 
          sub_category = '', 
          contact_name = '', 
          designation = '', 
          email = '', 
          website = '', 
          phone = '', 
          filling_month = '', 
          file_count = 0, 
          status = '', 
          region = '' 
        } = data[i];
  
        if (_id) {
          const updatedRegister = await Register.findByIdAndUpdate(
            _id,
            {
              company_name,
              registrationNumber,
              business_category,
              sub_category,
              contact_name,
              designation,
              email,
              website,
              phone,
              filling_month,
              file_count,
              status,
              region
            },
            { new: true } // Return the updated document
          );
  
          if (updatedRegister) {
            updatedRegisters.push(updatedRegister);
          }
        } else {
          // If _id is not present, insert a new record
          const newRegister = new Register({
            company_name,
            registrationNumber,
            business_category,
            sub_category,
            contact_name,
            designation,
            email,
            website,
            phone,
            filling_month,
            file_count,
            status,
            region
          });
  
          registersToSave.push(newRegister);
        }
      }
  
      // Insert all new registers at once
      if (registersToSave.length > 0) {
        await Register.insertMany(registersToSave);
      }
  
      // Return both updated and newly inserted registers
      res.status(200).json({
        success: true,
        message: "File upload saved successfully.",
        result: [...updatedRegisters, ...registersToSave]
      });
  
    } catch (error) {
      console.error("Error in saving register data:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  };
  
export let createContact = async (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
      try {
              const contactDetails: RegisterDocument = req.body;
              const createData = new Register(contactDetails);
              let insertData = await createData.save();
           
              response(req, res, activity, 'Level-2', 'Contact-Created', true, 200, insertData, clientError.success.savedSuccessfully);
      } catch (err: any) {
          response(req, res, activity, 'Level-3', 'Contact-Created', false, 500, {}, errorMessage.internalServer, err.message);
      }
  }
  else {
      response(req, res, activity, 'Level-3', 'Contact-Created', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
  }
}

export let getAllExcelData = async (req, res, next) => {
  try {
      const data = await Register.find({ isDeleted: false }).sort({ company_name: -1 });
      response(req, res, activity, 'Level-1', 'GetAll-University', true, 200, data, clientError.success.fetchedSuccessfully);
  } catch (err: any) {
      response(req, res, activity, 'Level-2', 'GetAll-University', false, 500, {}, errorMessage.internalServer, err.message);
  }
};

export const getSingleUpload = async (req, res) => {
  try {
      const data = await Register.findOne({ _id: req.query._id })
      response(req, res, activity, 'Level-1', 'GetSingle-Register', true, 200, data, clientError.success.fetchedSuccessfully)
  } catch (err: any) {
      response(req, res, activity, 'Level-1', 'GetSingle-Register', false, 500, {}, errorMessage.internalServer, err.message)
  }
}

export const updateCompany = async (req, res) => {
  const errors = validationResult(req)
  if (errors.isEmpty()) {
      try {
          const RegisterDetails: RegisterDocument = req.body;
          let statusData = await Register.findByIdAndUpdate({ _id: RegisterDetails._id }, {
              $set: {
                reg_no: RegisterDetails.reg_no,
                business_category: RegisterDetails.business_category,
                sub_category: RegisterDetails.sub_category,
                company_name: RegisterDetails.company_name,
                region: RegisterDetails.region,
                contact_name: RegisterDetails.contact_name, 
                designation: RegisterDetails.designation,
                lei_number: RegisterDetails.lei_number,
                email: RegisterDetails.email,
                phone: RegisterDetails.phone,
                country: RegisterDetails.country,
                website_link: RegisterDetails.website_link,
                filling_month: RegisterDetails.filling_month, 
                file_count: RegisterDetails.file_count,
                mobile: RegisterDetails.mobile, 
                linkedin: RegisterDetails.linkedin,
                street: RegisterDetails.street,
                block_no_bulinding: RegisterDetails.block_no_bulinding,
                city: RegisterDetails.city,
                zip: RegisterDetails.zip,
                services: RegisterDetails.services,
                tags: RegisterDetails.tags, 
                status: RegisterDetails.status,
                  modifiedOn: new Date(),
                  modifiedBy: RegisterDetails.modifiedBy,
              }
          });

          response(req, res, activity, 'Level-1', 'Update-Register Details', true, 200, statusData, clientError.success.updateSuccess);
      } catch (err: any) {
          response(req, res, activity, 'Level-2', 'Update-Register Details', false, 500, {}, errorMessage.internalServer, err.message);
      }
  }
  else {
      response(req, res, activity, 'Level-3', 'Update-Demo Details', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
  }
}

export let deleteRegister = async (req, res, next) => {

  try {
      const agent = await Register.findOneAndDelete({ _id: req.query._id })

      response(req, res, activity, 'Level-1', 'Delete-Register', true, 200, agent, 'Successfully Remove the Register');
  }
  catch (err: any) {
      response(req, res, activity, 'Level-2', 'Delete-Register', false, 500, {}, errorMessage.internalServer, err.message);
  }
};


export let getFilteredContact = async (req, res, next) => {
  try {
      var findQuery;
      var andList: any = []
      var limit = req.body.limit ? req.body.limit : 0;
      var page = req.body.page ? req.body.page : 0;
      andList.push({ isDeleted: false })
      // andList.push({ status: 1 })
     
      if (req.body.company_name) {
          andList.push({ programId: req.body.company_name })
      }
      findQuery = (andList.length > 0) ? { $and: andList } : {}

      const RegisterList = await Register.find(findQuery).sort({ RegisterCode: -1 }).limit(limit).skip(page)

      const RegisterCount = await Register.find(findQuery).count()
      response(req, res, activity, 'Level-1', 'Get-FilterRegister', true, 200, { RegisterList, RegisterCount }, clientError.success.fetchedSuccessfully);
  } catch (err: any) {
      response(req, res, activity, 'Level-2', 'Get-FilterRegister', false, 500, {}, errorMessage.internalServer, err.message);
  }
};

