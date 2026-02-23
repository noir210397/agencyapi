import path from "path"
import fs from "fs/promises"
import User, { IUser } from "src/models/user.model"
import { CreateClientRequest } from "src/validators/client/client.validators"
import { CreateJobRequest } from "src/validators/job/job.validators"
import Shift, { IShift } from "src/models/shift.model"
import { IBooking } from "src/types/booking"
import Booking from "src/models/booking.model"
import Client from "src/models/client.model"
import Job from "src/models/job.model"
type SeedingData = {
    users: IUser[],
    clients: CreateClientRequest[],
    jobs: CreateJobRequest[],
    shifts: IShift[],
    bookings: IBooking[]
}

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



export async function seedData() {
    try {
        const filePath = path.resolve("src", "seeding", "data.json");
        const dataString = await fs.readFile(filePath, { encoding: "utf-8" });
        const data = JSON.parse(dataString) as SeedingData;

        const { bookings, clients, jobs, shifts, users } = data;

        console.log("Clearing existing data...");

        await Booking.deleteMany({});
        await Client.deleteMany({});
        await Job.deleteMany({});
        await Shift.deleteMany({});
        await User.deleteMany({});


        console.log("Inserting clients...");
        const createdClients = await Client.insertMany(clients);

        console.log("Inserting users...");
        const createdUsers = await User.insertMany(users);

        console.log("Inserting jobs...");
        const createdJobs = await Job.insertMany(jobs);

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
        const createdShifts = await Shift.insertMany(preparedShifts);

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
    } catch (error) {
        console.error("Error seeding data:", error);
    }
}
