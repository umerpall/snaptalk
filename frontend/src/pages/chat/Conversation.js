import axios from "axios";
import { useEffect, useState } from "react";

const Conversation = ({ conversation, currentUser, currentChat }) => {
  const [otherUser, setOtherUser] = useState(null);

  useEffect(() => {
    const friendId = conversation.members.find(
      (member) => member !== currentUser.id
    );
    const getUser = async () => {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/getBasicUserInfo/${friendId}`,
        {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        }
      );
      setOtherUser(data);
    };
    getUser();
  }, [currentUser, conversation]);
  return (
    <div
      className="single_friend_conversation hover1"
      style={{
        backgroundColor: `${currentChat === conversation._id ? "#ffb100" : ""}`,
      }}
    >
      <img src={otherUser?.picture} alt="profile" />
      <p>
        {otherUser?.first_name} {otherUser?.last_name}
      </p>
    </div>
  );
};

export default Conversation;
