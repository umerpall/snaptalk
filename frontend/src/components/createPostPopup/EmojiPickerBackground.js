import { useState, useEffect, useRef } from "react";

const EmojiPickerBackground = ({
  user,
  text,
  setText,
  type2,
  background,
  setBackground,
  setEmojiPicker,
  emoji,
}) => {
  const [showBgs, setShowBgs] = useState(false);
  const [cursorPosition, setCursorPosition] = useState();
  const textRef = useRef(null);
  const bgRef = useRef(null);

  useEffect(() => {
    textRef.current.selectionEnd = cursorPosition;
  }, [cursorPosition]);

  useEffect(() => {
    handleEmoji(emoji);
  }, [emoji]);

  useEffect(() => {
    setText("");
  }, []);

  const handleEmoji = (emoji) => {
    const ref = textRef.current;
    ref.focus();
    const start = text?.substring(0, ref.selectionStart);
    const end = text?.substring(ref.selectionStart);
    const newText = start + emoji + end;
    setText(newText);
    setCursorPosition(start?.length + emoji?.length);
  };

  const postBackgrounds = [
    "../../../images/postBackgrounds/1.jpg",
    "../../../images/postBackgrounds/2.jpg",
    "../../../images/postBackgrounds/3.jpg",
    "../../../images/postBackgrounds/4.jpg",
    "../../../images/postBackgrounds/5.jpg",
    "../../../images/postBackgrounds/6.jpg",
    "../../../images/postBackgrounds/7.jpg",
    "../../../images/postBackgrounds/8.jpg",
    "../../../images/postBackgrounds/9.jpg",
  ];
  const backgroundHandler = (i) => {
    bgRef.current.style.background = `url(${postBackgrounds[i]})`;
    setBackground(postBackgrounds[i]);
    bgRef.current.classList.add("bgHandler");
  };
  const removeBackground = (i) => {
    bgRef.current.style.background = "";
    setBackground("");
    bgRef.current.classList.remove("bgHandler");
  };

  return (
    <div className={type2 ? "images_input" : ""}>
      <div className={!type2 ? "flex_center" : ""} ref={bgRef}>
        <textarea
          className={`post_input ${type2 ? "input2" : ""}`}
          maxLength="180"
          value={text}
          placeholder={`What's on your mind, ${user ? user.first_name : ""}?`}
          onChange={(e) => setText(e.target.value)}
          ref={textRef}
          style={{
            paddingTop: `${
              background
                ? Math.abs(textRef.current?.value.length * 0.1 - 25)
                : "0"
            }%`,
          }}
        ></textarea>
      </div>
      <div className={!type2 ? "post_emojis_wrap" : ""}>
        {!type2 && (
          <img
            src="../../../icons/colorful.png"
            alt="Text Background"
            onClick={() => {
              setShowBgs((prev) => !prev);
            }}
          />
        )}
        {!type2 && showBgs && (
          <div className="post_backgrounds">
            <div className="no_bg" onClick={() => removeBackground()}></div>
            {postBackgrounds.map((bg, i) => (
              <img
                src={bg}
                key={i}
                alt="Post Background"
                onClick={() => {
                  backgroundHandler(i);
                }}
              />
            ))}
          </div>
        )}
        <i
          className={`emoji_icon_large ${type2 ? "moveleft" : ""}`}
          onClick={() => setEmojiPicker((prev) => !prev)}
        ></i>
      </div>
    </div>
  );
};

export default EmojiPickerBackground;
