import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Header } from "../../components/header";
import Conversation from "./Conversation";
import Message from "./Message";
import axios from "axios";
import "./style.css";
import { search } from "../../functions/user";
import { io } from "socket.io-client";

const Chat = () => {
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [searchChatUser, setSearchChatUser] = useState("");
  const [searchChatUserList, setSearchChatUserList] = useState([]);
  const socket = useRef();
  const { user } = useSelector((state) => ({ ...state }));
  const scrollRef = useRef();

  useEffect(() => {
    socket.current = io("ws://localhost:8900");
    socket.current.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, []);

  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    socket.current.emit("addUser", user.id);
  }, [user]);

  useEffect(() => {
    const getConversations = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/getConversation/${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        setConversations(data);
      } catch (error) {
        console.log(error);
      }
    };
    getConversations();
  }, [user.id]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        if (currentChat) {
          const { data } = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/getMessages/${currentChat._id}`,
            {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            }
          );
          setMessages(data);
        }
      } catch (error) {}
    };
    getMessages();
  }, [currentChat]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleNewMessage = async () => {
    const message = {
      sender: user.id,
      text: newMessage,
      conversationId: currentChat._id,
    };

    const receiverId = currentChat?.members.find(
      (member) => member !== user.id
    );

    socket.current.emit("sendMessage", {
      senderId: user.id,
      receiverId,
      text: newMessage,
    });

    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/newMessage`,
        message,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      setMessages([...messages, data]);
      setNewMessage("");
    } catch (error) {
      console.log(error.message);
    }
  };

  const chatSearchHandler = async () => {
    if (searchChatUser === "") {
      setSearchChatUserList([]);
    } else {
      const res = await search(searchChatUser, user.token);
      setSearchChatUserList(res);
    }
  };

  const newConversation = async (searchedUserId) => {
    try {
      // Check whether the user is already in the conversation list
      let check = false;
      if (searchedUserId === user.id) {
        check = true;
      }
      conversations.find((conversation) =>
        conversation.members.find((member) => {
          if (member === searchedUserId) {
            check = true;
            return;
          }
        })
      );
      if (!check) {
        const { data } = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/newConversation`,
          {
            senderId: user.id,
            receiverId: searchedUserId,
          },
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        setConversations([...conversations, data]);
        setCurrentChat(data);
      }
      setSearchChatUser("");
      setSearchChatUserList([]);
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <>
      <Header page="chat" />
      <div className="messenger">
        <div className="chat_menu">
          <div className="chat_menu_wrapper">
            <input
              placeholder="Search for Friends..."
              className="chat_menu_input textarea_yellow"
              onKeyUp={() => chatSearchHandler()}
              onChange={(e) => setSearchChatUser(e.target.value)}
              value={searchChatUser}
            />
            {searchChatUserList?.length ? (
              <div className="conversations_box">
                {searchChatUserList.map((searchedUser, i) => (
                  <div
                    onClick={() => {
                      newConversation(searchedUser._id);
                    }}
                    key={i}
                  >
                    <div className="single_friend_conversation hover1">
                      <img src={searchedUser?.picture} alt="profile" />
                      <p>
                        {searchedUser?.first_name} {searchedUser?.last_name}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="conversations_box">
                {conversations.map((conversation, i) => (
                  <div
                    onClick={() => {
                      setCurrentChat(conversation);
                    }}
                    key={i}
                  >
                    <Conversation
                      conversation={conversation}
                      currentUser={user}
                      currentChat={currentChat?._id}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="chat_box">
          <div className="chat_box_wrapper">
            {currentChat ? (
              <>
                <div className="chat_box_top">
                  {messages.map((message, i) => (
                    <div key={i} ref={scrollRef}>
                      <Message
                        message={message}
                        own={message.sender === user.id}
                      />
                    </div>
                  ))}
                </div>
                <div className="chat_box_bottom">
                  <textarea
                    placeholder="Send Message..."
                    className="textarea_yellow"
                    onChange={(e) => setNewMessage(e.target.value)}
                    value={newMessage}
                  ></textarea>
                  <button
                    className="yellow_btn"
                    onClick={() => handleNewMessage()}
                  >
                    Send
                  </button>
                </div>
              </>
            ) : (
              <span className="no_conversation_text">
                Open a conversation to start a chat
              </span>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Chat;
