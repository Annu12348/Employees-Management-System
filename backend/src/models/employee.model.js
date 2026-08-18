import mongoose from 'mongoose';

const employeeSchema = mongoose.Schema(
    {
        employeeId: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            index: true
        },

        fullName: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true
        },

        mobileNumber: {
            type: String,
            required: true,
            trim: true
        },

        department: {
            type: String,
            required: true,
            trim: true,
            index: true
        },

        designation: {
            type: String,
            required: true,
            trim: true
        },

        salary: {
            type: Number,
            required: true
        },

        joiningDate: {
            type: Date,
            required: true
        },

        profileImage: {
            type: String,
            default: null
        }
    },
    {
        timestamps: true
    }
);

const employeeModel = mongoose.model("Employee", employeeSchema);
export default employeeModel;