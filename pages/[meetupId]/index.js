import { MongoClient, ObjectId } from 'mongodb';
import Head from 'next/head';

import MeetupDetail from "../../components/meetups/MeetupDetail";

function MeetupDetails(props) {
    return (
        <>
            <Head>
                <title>{props.meetupData.title}</title>
                <meta name="description" content={props.meetupData.description} />
            </Head>
            <MeetupDetail {...props.meetupData} />
        </>
    );
}

export async function getStaticProps(context) {
    //fetch data for a single meetup

    //meetupId in context is the identifier in []
    const meetupId = context.params.meetupId;

    const client = await MongoClient.connect('mongodb+srv://admin-user:Password@cluster0.zimjoes.mongodb.net/?retryWrites=true&w=majority');

    const db = client.db();
    const meetupsCollection = db.collection('meetups');
    console.warn('meetupId', meetupId)
    const selectedMeetup = await meetupsCollection.findOne({ _id: ObjectId(meetupId) });

    client.close();

    return {
        props: {
            meetupData: {
                title: selectedMeetup.title,
                description: selectedMeetup.description,
                address: selectedMeetup.address,
                image: selectedMeetup.image,
                id: selectedMeetup._id.toString(),
            },
        }
    }
}

//needed if you use getStaticProps on a dynamic page like this
//for pregenerating page content for all dynamic paths
// here we discribe all the dynamic values for which the page should be pre-generated
export async function getStaticPaths() {
    const client = await MongoClient.connect('mongodb+srv://admin-user:Password@cluster0.zimjoes.mongodb.net/?retryWrites=true&w=majority');

    const db = client.db();
    const meetupsCollection = db.collection('meetups');

    const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray();

    client.close();


    return {
        // in a normal app I won't be hard-coding this but instead fetching it from a data-base and generating this array automatically
        // paths: [
        //     { 
        //         params: {
        //             meetupId: 'm1',

        //         }
        //     },
        //     { 
        //         params: {
        //             meetupId: 'm2',

        //         }
        //     }
        // ],
        paths: (meetups).map(meetup  => ({
            params: {
                meetupId: meetup._id.toString(),
            }
        })),
        fallback: false,
    }
}

export default MeetupDetails;
