import { MongoClient } from 'mongodb';

// functions including server-side code
// these .js pages only run on the server, never on the client
// they allow you to creat e API endpoints
// these functions are triggered when a request is made to this route
// POST /api/new-meetup requests will trigger the function below

async function handler(req, res) {
    if(req.method === 'POST') {
        const data = req.body;

        //const {title, image, address, description} = data;

        const client = await MongoClient.connect('mongodb+srv://admin-user:Password@cluster0.zimjoes.mongodb.net/?retryWrites=true&w=majority');

        const db = client.db();
        const meetupsCollection = db.collection('meetups');
        const result = await meetupsCollection.insertOne(data);

        console.log(result);

        client.close();

        res.status(201).json({ message: 'Meetup inserted!' })
    }
}

export default handler
