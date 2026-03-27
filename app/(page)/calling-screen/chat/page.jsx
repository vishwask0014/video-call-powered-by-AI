"use client";
import { useState, useEffect, useMemo } from "react";
import {
  useCreateChatClient,
  Chat,
  Channel,
  ChannelHeader,
  MessageInput,
  MessageList,
  Thread,
  Window,
  ChannelList,
  WithDragAndDropUpload,
  AIStateIndicator,
} from "stream-chat-react";
import "stream-chat-react/dist/css/v2/index.css";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
const userId = "gentle-poetry-3";
const userName = "gentle";
const userToken = process.env.NEXT_PUBLIC_STREAM_USER_TOKEN;

const user = {
  id: userId,
  name: userName,
  image: `https://getstream.io/random_png/?name=${userName}`,
};

const Page = () => {
  // const [channel, setChannel] = useState();
  // console.log(channel, ">>>chanel");

  const client = useCreateChatClient({
    apiKey,
    tokenOrProvider: userToken,
    userData: user,
  });

  const channel = useMemo(() => {
    if (!client) return null;

    return client.channel("messaging", "custom_channel_id", {
      name: "Video Call React",
      image: "https://getstream.io/random_png/?name=video-call-react",
      members: [userId],
    });
  }, [client]);

  if (!client) return <div>Setting up client & connection...</div>;

  return (
    <>
      <div className="chatScreen">
        <Chat client={client} theme="dark" customClasses="flex gap-6">
          <ChannelList />
          <Channel channel={channel}>
            <Window>
              <WithDragAndDropUpload
                style={{
                  display: "flex",
                  flexDirection: "column",
                  flexGrow: 1,
                  position: "relative",
                }}
              >
                <ChannelHeader />
                <MessageList />
                <AIStateIndicator />
                <MessageInput focus />
              </WithDragAndDropUpload>
            </Window>
            <Thread />
          </Channel>
        </Chat>
      </div>
    </>
  );
};

export default Page;
