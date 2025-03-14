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

export let createContact = async (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
      try {
              const contactDetails: FileDocument = req.body;
              const createData = new File(contactDetails);
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
      const data = await File.find({ isDeleted: false }).sort({ company_name: -1 });
      response(req, res, activity, 'Level-1', 'GetAll-University', true, 200, data, clientError.success.fetchedSuccessfully);
  } catch (err: any) {
      response(req, res, activity, 'Level-2', 'GetAll-University', false, 500, {}, errorMessage.internalServer, err.message);
  }
};

export const getSingleUpload = async (req, res) => {
  try {
      const data = await File.findOne({ _id: req.query._id })
      response(req, res, activity, 'Level-1', 'GetSingle-File', true, 200, data, clientError.success.fetchedSuccessfully)
  } catch (err: any) {
      response(req, res, activity, 'Level-1', 'GetSingle-File', false, 500, {}, errorMessage.internalServer, err.message)
  }
}

export const updateCompany = async (req, res) => {
  const errors = validationResult(req)
  if (errors.isEmpty()) {
      try {
          const FileDetails: FileDocument = req.body;
          let statusData = await File.findByIdAndUpdate({ _id: FileDetails._id }, {
              $set: {
                reg_no: FileDetails.reg_no,
                business_category: FileDetails.business_category,
                sub_category: FileDetails.sub_category,
                company_name: FileDetails.company_name,
                region: FileDetails.region,
                contact_name: FileDetails.contact_name, 
                designation: FileDetails.designation,
                lei_number: FileDetails.lei_number,
                email: FileDetails.email,
                phone: FileDetails.phone,
                country: FileDetails.country,
                website_link: FileDetails.website_link,
                filling_month: FileDetails.filling_month, 
                file_count: FileDetails.file_count,
                mobile: FileDetails.mobile, 
                linkedin: FileDetails.linkedin,
                street: FileDetails.street,
                block_no_bulinding: FileDetails.block_no_bulinding,
                city: FileDetails.city,
                zip: FileDetails.zip,
                services: FileDetails.services,
                tags: FileDetails.tags, 
                status: FileDetails.status,
                  modifiedOn: new Date(),
                  modifiedBy: FileDetails.modifiedBy,
              }
          });

          response(req, res, activity, 'Level-1', 'Update-File Details', true, 200, statusData, clientError.success.updateSuccess);
      } catch (err: any) {
          response(req, res, activity, 'Level-2', 'Update-File Details', false, 500, {}, errorMessage.internalServer, err.message);
      }
  }
  else {
      response(req, res, activity, 'Level-3', 'Update-Demo Details', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
  }
}

export let deleteFile = async (req, res, next) => {

  try {
      const agent = await File.findOneAndDelete({ _id: req.query._id })

      response(req, res, activity, 'Level-1', 'Delete-File', true, 200, agent, 'Successfully Remove the File');
  }
  catch (err: any) {
      response(req, res, activity, 'Level-2', 'Delete-File', false, 500, {}, errorMessage.internalServer, err.message);
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

      const FileList = await File.find(findQuery).sort({ FileCode: -1 }).limit(limit).skip(page)

      const FileCount = await File.find(findQuery).count()
      response(req, res, activity, 'Level-1', 'Get-FilterFile', true, 200, { FileList, FileCount }, clientError.success.fetchedSuccessfully);
  } catch (err: any) {
      response(req, res, activity, 'Level-2', 'Get-FilterFile', false, 500, {}, errorMessage.internalServer, err.message);
  }
};