"use client";

import {
  Call,
  CallControls,
  SpeakerLayout,
  StreamCall,
  StreamVideo,
  StreamVideoClient,
  User,
} from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";

// CSS import for Stream Video React SDK
//  TODO: Not working properly, need to check the documentation for the correct way to import the CSS
import "@stream-io/video-react-sdk/dist/css/styles.css";

// POST Method:  to fetch the token from the backend API route (api/token/route.tsx)
const getToken = async (userId: string) => {
  const res = await fetch("api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId }),
  });

  const data = await res?.json();
  return data.token;
};

const apiKey = process.env.NEXT_PUBLIC_API_KEY;
const userId = "sara";
// Fetch the token for the user and log it to the console
const token = await getToken(userId).then((token) => {
  return token;
});

const user: User = {
  id: userId,
  name: "User " + userId,
};

const Page = () => {
  const [client, setClient] = useState<StreamVideoClient>();
  console.log(client, ">>>>>>json");

  // console.log(client.getDevices);

  useEffect(() => {
    const myClient = new StreamVideoClient({ apiKey, token, user });
    setClient(myClient);

    return () => {
      myClient.disconnectUser();
    };
  }, []);

  if (!client) return <div>Loading...</div>;

  return (
    <>
      <StreamVideo client={client}>
        <VideoUI client={client} />
      </StreamVideo>
    </>
  );
};

export default Page;

const VideoUI = ({ client }: { client: StreamVideoClient }) => {
  const [call, setCall] = useState<Call | null>(null);

  useEffect(() => {
    const myCall = client.call("default", "my-first-call");

    myCall.join({ create: true }).catch(console.error);
    setCall(myCall);

    return () => {
      myCall.leave().catch(console.error);
    };
  }, [client]);

  if (!call) return <div>Joining call...</div>;

  return (
    <StreamCall call={call}>
      <SpeakerLayout participantsBarPosition="left" />
      <CallControls />
    </StreamCall>
  );
};
