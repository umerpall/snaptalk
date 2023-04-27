import React from "react";
import Moment from "react-moment";

const Message = ({ own, message }) => {
  return (
    <div className={`message ${own ? "own" : ""} `}>
      <div className="message_top">
        <img
          className="message_img"
          src="../../../images/default_pic.png"
          alt=""
        />
        <p className="message_text">{message.text}</p>
      </div>
      <div className="message_bottom">
        <Moment fromNow interval={60}>
          {message.createdAt}
        </Moment>
      </div>
    </div>
  );
};

export default Message;
