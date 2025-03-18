import { validationResult } from "express-validator";
import { clientError, errorMessage } from "../helper/ErrorMessage";
import { response } from "../helper/commonResponseHandler";
import { Website, WebsiteDocument } from "../model/website.models";
import * as TokenManager from "../utils/tokenManager";
import { hashPassword } from "../helper/Encryption";
import axios from 'axios';

const activity = "Website";

// Add Excel data to the database
export const addExcelData = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const data = req.body;
    await Website.insertMany(data);
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
      const websitesToSave = [];
  
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
          const updatedWebsite = await Website.findByIdAndUpdate(
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
  
          if (updatedWebsite) {
            updatedRegisters.push(updatedWebsite);
          }
        } else {
          // If _id is not present, insert a new record
          const newWebsite = new Website({
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
  
          websitesToSave.push(newWebsite);
        }
      }
  
      // Insert all new registers at once
      if (websitesToSave.length > 0) {
        await Website.insertMany(websitesToSave);
      }
  
      // Return both updated and newly inserted registers
      res.status(200).json({
        success: true,
        message: "File upload saved successfully.",
        result: [...updatedRegisters, ...websitesToSave]
      });
  
    } catch (error) {
      console.error("Error in saving register data:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  };
  
export let createWebsite = async (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
      try {
              const contactDetails: WebsiteDocument = req.body;
              const createData = new Website(contactDetails);
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

export let getAllWebsite = async (req, res, next) => {
  try {
      const data = await Website.find({ isDeleted: false }).sort({ company_name: -1 });
      response(req, res, activity, 'Level-1', 'GetAll-University', true, 200, data, clientError.success.fetchedSuccessfully);
  } catch (err: any) {
      response(req, res, activity, 'Level-2', 'GetAll-University', false, 500, {}, errorMessage.internalServer, err.message);
  }
};

export const getSingleWebsite= async (req, res) => {
  try {
      const data = await Website.findOne({ _id: req.query._id })
      response(req, res, activity, 'Level-1', 'GetSingle-Register', true, 200, data, clientError.success.fetchedSuccessfully)
  } catch (err: any) {
      response(req, res, activity, 'Level-1', 'GetSingle-Register', false, 500, {}, errorMessage.internalServer, err.message)
  }
}

export const updateWebsite = async (req, res) => {
  const errors = validationResult(req)
  if (errors.isEmpty()) {
      try {
          const WebsiteDetails: WebsiteDocument = req.body;
          let statusData = await Website.findByIdAndUpdate({ _id: WebsiteDetails._id }, {
              $set: {
                reg_no: WebsiteDetails.reg_no,
                business_category: WebsiteDetails.business_category,
                sub_category: WebsiteDetails.sub_category,
                company_name: WebsiteDetails.company_name,
                region: WebsiteDetails.region,
                contact_name: WebsiteDetails.contact_name, 
                designation: WebsiteDetails.designation,
                lei_number: WebsiteDetails.lei_number,
                email: WebsiteDetails.email,
                phone: WebsiteDetails.phone,
                country: WebsiteDetails.country,
                website_link: WebsiteDetails.website_link,
                filling_month: WebsiteDetails.filling_month, 
                file_count: WebsiteDetails.file_count,
                mobile: WebsiteDetails.mobile, 
                linkedin: WebsiteDetails.linkedin,
                street: WebsiteDetails.street,
                block_no_bulinding: WebsiteDetails.block_no_bulinding,
                city: WebsiteDetails.city,
                zip: WebsiteDetails.zip,
                services: WebsiteDetails.services,
                tags: WebsiteDetails.tags, 
                status: WebsiteDetails.status,
                  modifiedOn: new Date(),
                  modifiedBy: WebsiteDetails.modifiedBy,
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

export let deleteWebsite = async (req, res, next) => {

  try {
      const agent = await Website.findOneAndDelete({ _id: req.query._id })

      response(req, res, activity, 'Level-1', 'Delete-Register', true, 200, agent, 'Successfully Remove the Register');
  }
  catch (err: any) {
      response(req, res, activity, 'Level-2', 'Delete-Register', false, 500, {}, errorMessage.internalServer, err.message);
  }
};


export let getFilteredWebsite = async (req, res, next) => {
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

      const WebsiteList = await Website.find(findQuery).sort({ WebsiteCode: -1 }).limit(limit).skip(page)

      const WebsiteCount = await Website.find(findQuery).count()
      response(req, res, activity, 'Level-1', 'Get-FilterRegister', true, 200, { WebsiteList, WebsiteCount }, clientError.success.fetchedSuccessfully);
  } catch (err: any) {
      response(req, res, activity, 'Level-2', 'Get-FilterRegister', false, 500, {}, errorMessage.internalServer, err.message);
  }
};

