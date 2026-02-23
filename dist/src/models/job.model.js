import { Schema, model, } from 'mongoose';
//holds jobs temps or perm
const jobSchema = new Schema({
    applyViaIndeed: { type: String, default: null },
    address: {
        postCode: String,
        streetAddress: String,
        town: String
    },
    type: String,
    pay: {
        minPay: Number,
        maxPay: Number
    },
    sectors: [String],
    description: String,
    whatYouNeed: [String],
    days: [String],
    shiftTimes: [String],
    applicationEmail: String
}, {
    timestamps: true
});
const Job = model('Jobs', jobSchema);
export default Job;
