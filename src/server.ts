import 'dotenv/config';
import { connectDB } from './config/db.config';
import app from './config/app.config';
// import { seedData } from './seeding/seeder';
const PORT = process.env.PORT || 3000

async function startServer() {
    try {
        await connectDB()
        app.listen(PORT, async (err) => {
            if (err) throw err
            if (process.env.ENV === "DEV") {
                // await seedData()
                console.log(`url: http://localhost:${PORT}`);
            }
        })
    }
    catch (err) {
        console.log(err);
        // console.log("fixed2");

    }
}
startServer()