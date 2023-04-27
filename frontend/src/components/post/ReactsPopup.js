import { reactPost } from "../../functions/post";
import { useState } from "react";
import { useSelector } from "react-redux";

const reactsArray = [
  {
    name: "like",
    image: "../../../reacts/like.gif",
  },
  {
    name: "love",
    image: "../../../reacts/love.gif",
  },
  {
    name: "haha",
    image: "../../../reacts/haha.gif",
  },
  {
    name: "wow",
    image: "../../../reacts/wow.gif",
  },
  {
    name: "sad",
    image: "../../../reacts/sad.gif",
  },
  {
    name: "angry",
    image: "../../../reacts/angry.gif",
  },
];
const ReactsPopup = ({ visible, setVisible, reactHandler }) => {
  return (
    <>
      {visible && (
        <div
          onMouseOver={() =>
            setTimeout(() => {
              setVisible(true);
            }, 500)
          }
          onMouseLeave={() =>
            setTimeout(() => {
              setVisible(false);
            }, 500)
          }
          className="reacts_popup"
        >
          {reactsArray.map((react, i) => (
            <div
              className="react"
              key={i}
              onClick={() => reactHandler(react.name)}
            >
              <img src={react.image} alt={react.name} />
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default ReactsPopup;
