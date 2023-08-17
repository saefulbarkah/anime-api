import express from 'express';
import dotenv from 'dotenv';
import ongoingRoute from './routes/ongoing.js';
dotenv.config();
const app = express();
const port = process.env.PORT;
const host = process.env.HOST;
app.use(express.json());
app.get('/', (req, res) => {
    res.send({
        message: 'OTAKUDESU API',
        routes: {
            ongoing: '/ongoing',
            'release schedule': '/release-schedule',
            genres: '/genres',
            'complete-anime': '/complete-anime',
        },
    });
});
app.use('/ongoing-anime', ongoingRoute);
app.listen(port, () => {
    console.log(`Otakudesu API running on ${host}:${port}`);
});
