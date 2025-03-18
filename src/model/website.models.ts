import mongoose from 'mongoose';

export interface WebsiteDocument extends mongoose.Document {
    _id?: any;
    sno: Number,
  lei_number: String,
  reg_no: String,
  business_category: String,
  sub_category: String,
  company_name: String,
  region: String,
  contact_name: String,
  designation: String,
  email: String,
  phone: String,
  country: String,
  website_link: String,
  filling_month: String,
  file_count: Number,
  mobile: String,
  linkedin: String,
  street: String,
  block_no_bulinding: String,
  city: String,
  zip: String,
  services: String,
  tags: String,
  status: String,
  isDeleted?: boolean;
  modifiedOn?: Date;
  modifiedBy?: string;
  createdOn?: Date;
  createdBy?: string;
};

const fileSchema = new mongoose.Schema({
    _id: { type: mongoose.Types.ObjectId, required: true, auto: true },
    sno: { type: String },
    lei_number: { type: String },
    reg_no: { type: String },
    business_category:{ type: String },
    sub_category:{ type: String },
    company_name: { type: String },
    region:{ type: String },
    contact_name:{ type: String },
    designation:{ type: String },
    email:{ type: String },
    phone: { type: String },
    country:{ type: String },
    website_link: { type: String },
    filling_month:{ type: String },
    file_count:{ type: Number},
    mobile:{ type: Number },
    linkedin:{ type: String },
    street: { type: String },
    block_no_bulinding: { type: String },
    city: { type: String },
    zip: { type: String },
    services:{ type: String },
    tags:{ type: String },
    status:{ type: String },
    isDeleted: { type: Boolean, default: false },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
    createdOn: { type: Date },
    createdBy: { type: String }
});

export const Website = mongoose.model('Website', fileSchema);

