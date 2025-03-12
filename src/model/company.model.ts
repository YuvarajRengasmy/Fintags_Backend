import mongoose from 'mongoose';

export interface CompanyDocument extends mongoose.Document {
    _id?: any;
    name?: string;
    email?: string;
    mobile?: number;
    website?: string;
    password?: string;
    contactPerson?: string;
    isDeleted?: boolean;
    status?: number;
    modifiedOn?: Date;
    modifiedBy?: string;
    createdOn?: Date;
    createdBy?: string;
};

const companySchema = new mongoose.Schema({
    _id: { type: mongoose.Types.ObjectId, required: true, auto: true },
    name: { type: String },
    email: { type: String },
    mobile: { type: Number },
    website: { type: String },
    password: { type: String },
    contactPerson: { type: String },
    isDeleted: { type: Boolean, default: false },
    status: { type: Number, default: 1 },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
    createdOn: { type: Date },
    createdBy: { type: String }
});

export const Company = mongoose.model('Company', companySchema);