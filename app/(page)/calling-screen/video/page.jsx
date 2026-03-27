"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  StreamVideoClient,
  StreamVideo,
  StreamCall,
  StreamTheme,
  RingingCall,
  PaginatedGridLayout,
  CallControls,
} from "@stream-io/video-react-sdk";
import {
  Channel,
  Chat,
  useCreateChatClient,
  MessageInput,
  MessageList,
  Thread,
  Window,
  WithDragAndDropUpload,
} from "stream-chat-react";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import "stream-chat-react/dist/css/v2/index.css";
import { MessageCircle } from "lucide-react";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
const userId = "gentle-poetry-3";
const userName = "gentle";
const userToken = process.env.NEXT_PUBLIC_STREAM_USER_TOKEN;

const user = {
  id: userId,
  name: userName,
  image: `https://getstream.io/random_png/?name=${userName}`,
};

function Page() {
  const [videoClient, setVideoClient] = useState(null);
  const [call, setCall] = useState(null);
  const [showChat, setShowChat] = useState(false);

  const chatClient = useCreateChatClient({
    apiKey,
    tokenOrProvider: userToken,
    userData: user,
  });

  const channel = useMemo(() => {
    if (!chatClient) return null;
    return chatClient.channel("messaging", "custom_channel_id", {
      name: "Video Call",
      image: "https://getstream.io/random_png/?name=video-call",
      members: [userId],
    });
  }, [chatClient]);

  useEffect(() => {
    const client = new StreamVideoClient({
      apiKey,
      user,
      token: userToken,
    });

    setVideoClient(client);

    return () => {
      client.disconnectUser();
    };
  }, []);

  useEffect(() => {
    if (!videoClient) return;

    const callInstance = videoClient.call("default", "video-call-react");
    setCall(callInstance);

    callInstance.join({ create: true }).catch((error) => {
      console.error("Failed to join call:", error);
    });

    return () => {
      setCall(null);
      callInstance.leave().catch((error) => {
        console.error("Failed to leave call:", error);
      });
    };
  }, [videoClient]);

  if (!chatClient || !videoClient || !call || !channel)
    return <div>Loading...</div>;

  return (
    <>
      <div className="mt-8">
        <Chat client={chatClient}>
          <StreamVideo client={videoClient}>
            <StreamTheme>
              <StreamCall call={call}>
                {/* <SpeakerLayout /> */}
                <PaginatedGridLayout
                  groupSize={4}
                  mirrorLocalParticipantVideo={false}
                  pageArrowsVisible={true}
                  mutedParticipantsVisible={true}
                  muted
                />

                {false ? <RingingCall /> : ""}

                <div className="flex items-center justify-center mt-3 gap-4">
                  <CallControls />
                  {/* On click of this show chat screen */}
                  <button
                    onClick={() => setShowChat(!showChat)}
                    className="flex items-center justify-center w-9 h-9  bg-[#dc433b] hover:bg-[#e96962] rounded-full text-white"
                  >
                    <MessageCircle size={20} />
                  </button>
                </div>
              </StreamCall>

              {showChat ? (
                <div className="fixed right-6 top-24 z-30 h-[70vh] w-[360px] overflow-hidden rounded-2xl border border-white/10 bg-black/70 text-white shadow-2xl backdrop-blur-md">
                  <Channel channel={channel}>
                    <Window>
                      <WithDragAndDropUpload
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          height: "100%",
                        }}
                      >
                        {/* <ChannelHeader /> */}
                        <MessageList />
                        <MessageInput focus />
                      </WithDragAndDropUpload>
                    </Window>
                    <Thread />
                  </Channel>
                </div>
              ) : null}
            </StreamTheme>
          </StreamVideo>
        </Chat>
      </div>
    </>
  );
}

export default Page;
