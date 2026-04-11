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

// POST Method:  to fetch the token from the backend API route (api/token/route.tsx)
const getToken = async (userId: string): Promise<string> => {
  try {
    const res = await fetch("/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    return data.token || "";
  } catch (error) {
    console.error("Error fetching token:", error);
    return "";
  }
};

const apiKey = process.env.NEXT_PUBLIC_API_KEY || "";
const userId = "sara";

const user: User = {
  id: userId,
  name: "User " + userId,
};

const Page = () => {
  const [client, setClient] = useState<StreamVideoClient | undefined>();
  const [token, setToken] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const initializeClient = async () => {
      try {
        setLoading(true);
        const fetchedToken = await getToken(userId);
        setToken(fetchedToken);
        
        // Ensure apiKey is a string and token exists
        if (typeof apiKey === 'string' && apiKey.length > 0 && fetchedToken) {
          const myClient = new StreamVideoClient({ 
            apiKey: apiKey as string, 
            token: fetchedToken, 
            user 
          });
          setClient(myClient);

          return () => {
            myClient.disconnectUser();
          };
        } else {
          console.error("Missing apiKey or token");
        }
      } catch (error) {
        console.error("Error initializing client:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeClient();
  }, []);

  if (loading || !client) return <div>Loading...</div>;

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
