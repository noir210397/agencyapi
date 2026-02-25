"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedData = seedData;
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
const user_model_1 = __importDefault(require("../models/user.model"));
const shift_model_1 = __importDefault(require("../models/shift.model"));
const booking_model_1 = __importDefault(require("../models/booking.model"));
const client_model_1 = __importDefault(require("../models/client.model"));
const job_model_1 = __importDefault(require("../models/job.model"));
// export async function seedData() {
//     try {
//         const filePath = path.resolve("src", "seeding", "data.json")
//         const dataString = await fs.readFile(filePath, { encoding: "utf-8" })
//         const data = JSON.parse(dataString) as SeedingData
//         console.log(data);
//         const {bookings,clients,jobs,shifts,users}=data
//     } catch (error) {
//         console.log(error);
//         console.log("unable to seed data");
//     }
// }
async function seedData() {
    try {
        const filePath = path_1.default.resolve("src", "seeding", "data.json");
        const dataString = await promises_1.default.readFile(filePath, { encoding: "utf-8" });
        const data = JSON.parse(dataString);
        const { bookings, clients, jobs, shifts, users } = data;
        console.log("Clearing existing data...");
        await booking_model_1.default.deleteMany({});
        await client_model_1.default.deleteMany({});
        await job_model_1.default.deleteMany({});
        await shift_model_1.default.deleteMany({});
        await user_model_1.default.deleteMany({});
        console.log("Inserting clients...");
        const createdClients = await client_model_1.default.insertMany(clients);
        console.log("Inserting users...");
        const createdUsers = await user_model_1.default.insertMany(users);
        console.log("Inserting jobs...");
        const createdJobs = await job_model_1.default.insertMany(jobs);
        console.log("Preparing shifts...");
        const preparedShifts = shifts.map((shift) => {
            const start = new Date();
            start.setDate(start.getDate() + 1 + Math.floor(Math.random() * 5)); // tomorrow + 0-4 days
            start.setHours(8, 0, 0, 0); // 08:00 AM
            const durationHours = Math.random() > 0.5 ? 8 : 12;
            const end = new Date(start.getTime() + durationHours * 60 * 60 * 1000);
            return {
                ...shift,
                startTime: start,
                endTime: end,
                agentsBooked: 0,
            };
        });
        console.log("Inserting shifts...");
        const createdShifts = await shift_model_1.default.insertMany(preparedShifts);
        // console.log("Preparing bookings...");
        // const preparedBookings = bookings.map((booking) => {
        //   // Find a random shift and client for booking
        //   const randomShift = createdShifts[Math.floor(Math.random() * createdShifts.length)];
        //   const randomClient = createdClients[Math.floor(Math.random() * createdClients.length)];
        //   const start = new Date(randomShift.startTime);
        //   const end = new Date(randomShift.endTime);
        //   return {
        //     ...booking,
        //     client: randomClient,
        //     shiftId: randomShift._id,
        //     agentId: null,
        //     agentDetails: { fullName: "", email: "" },
        //     startTime: start,
        //     endTime: end,
        //     wasPresent: false,
        //     status: "active",
        //     isActive: true,
        //     isCancelled: false,
        //   };
        // });
        // console.log("Inserting bookings...");
        // await Booking.insertMany(preparedBookings);
        console.log("Seeding complete!");
    }
    catch (error) {
        console.error("Error seeding data:", error);
    }
}
