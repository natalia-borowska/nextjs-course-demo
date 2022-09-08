import { useRouter } from 'next/router';
import Head from 'next/head';

import NewMeetupForm from '../../components/meetups/NewMeetupForm';

function NewMeetup() {
    const router = useRouter();
    async function addMeetupHandler(enteredMeetupData) {
        const response = await fetch('/api/new-meetup', {
            method: 'POST',
            body: JSON.stringify(enteredMeetupData),
            headers: {
                'Content-Type': 'application/json',
            }
        });

        const data = await response.json();

        console.log(data);

        router.push('/');
    }

    return (
        <>
            <Head>
                <title>Add a new meetup</title>
                <meta name="description" content="Add a new meetup" />
            </Head>
            <NewMeetupForm onAddMeetup={addMeetupHandler} />
        </>
    );
}

export default NewMeetup
