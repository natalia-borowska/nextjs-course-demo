import Head from 'next/head';
import { MongoClient } from 'mongodb';

import MeetupList from '../components/meetups/MeetupList';

function HomePage(props) {
    //no longer needed with pre-rendering being used
    // const [loadedMeetups, setLoadedMeetups] = useState([]);
    // useEffect(() => {
    //     // send http request and fetch data
    //     setLoadedMeetups(DUMMY_MEETUPS);
    // }, []);

    return (
        <>
            <Head>
                <title>React meetups</title>
                <meta name="description" content="Browse a big list of meetups" />
            </Head>
            <MeetupList const meetups={props.meetups} />
        </>
    );
}

/*
// ALTERNATIVE to getStaticProps:
// difference to getStaticProps is that this function will not run during the build process
// but always on the server, after deployment
// this code only runs on the server, never on the client machine
// this is guaranteed to run for every request (but it also means that you need to wait for your pageto be generated on every request)

export async function getServerSideProps(context) {
    // fetch data from API/file system, etc
    // you can get access to the request object
    const req = context.req;
    const res = context.res;

    return {
        props: {
            meetups: DUMMY_MEETUPS
        }
    }
}
*/

// works only in pages folder, this is executed during the pre-rendering process
// here you can do server-side stuff, it will never end up on the client-side
// this code is executed during the build process, so it will never get executed on the visitor machines
// if you don't have big quantities of data that change all the time and if you don't need access to the req and res objects use this
export async function getStaticProps() {
    //fetch data from API/read data from file system
    // so because the data is pre-fetched, we no longer need to manage state inside of the component

    // you can use fetch on server-side code with nextjs (create a file /api/meetups.js), 
    //fetch('/api/meetups')
    //but  it's better to directly request it here, on the server side
    // we don't need to make a request to our own api unless it's on the client side
    const client = await MongoClient.connect('mongodb+srv://admin-user:Password@cluster0.zimjoes.mongodb.net/?retryWrites=true&w=majority');

    const db = client.db();
    const meetupsCollection = db.collection('meetups');
    
    const meetups = await meetupsCollection.find().toArray();

    client.close();

    return {
        props: {
            meetups: meetups.map(meetup => ({
                title: meetup.title,
                image: meetup.image,
                address: meetup.address,
                id: meetup._id.toString(),
            })),
        },
        // we unlock a feature called incremental static generation- we can fetch data after it was updated,
        // not only during the build process- it is no of seconds next.js will wait before regenerating the data source on the server
        revalidate: 10
    };
}

export default HomePage;
