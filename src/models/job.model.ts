import { Schema, model, } from 'mongoose';
import { CreateJobRequest } from 'src/validators/job/job.validators';

//holds jobs temps or perm

const jobSchema = new Schema<CreateJobRequest>({
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
export default Job
