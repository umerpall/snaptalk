import "./style.css";
import { useState, useRef } from "react";
import EmojiPickerBackground from "./EmojiPickerBackground";
import AddtoYourPost from "./AddtoYourPost";
import ImagePreview from "./ImagePreview";
import useClickOutside from "../../helpers/clickOutside";
import { createPost } from "../../functions/post";
import PulseLoader from "react-spinners/PulseLoader";
import PostError from "./PostError";
import dataURItoBlob from "../../helpers/dataURItoBlob";
import { uploadImages } from "../../functions/uploadImages";
import EmojiPicker from "emoji-picker-react";
import { useMediaQuery } from "react-responsive";

const CreatePostPopup = ({ user, setVisible, posts, dispatch, profile }) => {
  const popupRef = useRef(null);
  const [text, setText] = useState("");
  const [showPrev, setShowPrev] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [images, setImages] = useState([]);
  const [background, setBackground] = useState("");
  const [emojiPicker, setEmojiPicker] = useState(false);
  const [emoji, setEmoji] = useState();

  // useClickOutside(popupRef, () => {
  //   setVisible(false);
  // });

  const postSubmit = async () => {
    if (background) {
      setLoading(true);
      const res = await createPost(
        null,
        background,
        text,
        null,
        user.id,
        user.token
      );
      setLoading(false);
      if (res.status === "Success") {
        dispatch({
          type: profile ? "PROFILE_POSTS" : "POSTS_SUCCESS",
          payload: [res.data, ...posts],
        });
        setBackground("");
        setText("");
        setVisible(false);
      } else {
        setError(res);
      }
    } else if (images && images.length) {
      setLoading(true);
      const postImages = images.map((img) => {
        return dataURItoBlob(img);
      });
      const path = `${user.username}/post_images`;
      let formData = new FormData();
      formData.append("path", path);
      postImages.forEach((image) => {
        formData.append("file", image);
      });
      const res = await uploadImages(formData, path, user.token);
      const response = await createPost(
        null,
        null,
        text,
        res,
        user.id,
        user.token
      );
      setLoading(false);
      if (response.status === "Success") {
        dispatch({
          type: profile ? "PROFILE_POSTS" : "POSTS_SUCCESS",
          payload: [response.data, ...posts],
        });
        setText("");
        setImages([]);
        setVisible(false);
      } else {
        setError(response);
      }
    } else if (text) {
      setLoading(true);
      const res = await createPost(null, null, text, null, user.id, user.token);
      setLoading(false);
      if (res.status === "Success") {
        dispatch({
          type: profile ? "PROFILE_POSTS" : "POSTS_SUCCESS",
          payload: [res.data, ...posts],
        });
        setBackground("");
        setText("");
        setVisible(false);
      } else {
        setError(res);
      }
    } else {
      console.log("No Content added to the post");
    }
  };

  const view1 = useMediaQuery({
    query: "(max-width: 1015px)",
  });

  return (
    <div className="blur">
      {emojiPicker && (
        <div className="movepicker2">
          {view1 && (
            <EmojiPicker
              emojiStyle="twitter"
              width={310}
              height={290}
              onEmojiClick={({ emoji }) => setEmoji(emoji)}
            />
          )}
          {!view1 && (
            <EmojiPicker
              emojiStyle="twitter"
              width={310}
              height={430}
              onEmojiClick={({ emoji }) => setEmoji(emoji)}
            />
          )}
        </div>
      )}
      <div className="post_box" ref={popupRef}>
        {error && <PostError error={error} setError={setError} />}
        <div className="box_header">
          <div className="small_circle" onClick={() => setVisible(false)}>
            <i className="exit_icon"></i>
          </div>
          <span>Create Post</span>
        </div>
        <div className="box_profile">
          <img src={user ? user.picture : ""} alt="Profile" />
          <div className="box_profile_name">
            {user ? user.first_name : ""} {user ? user.last_name : ""}
          </div>
        </div>
        {!showPrev ? (
          <>
            <EmojiPickerBackground
              showPrev={showPrev}
              text={text}
              setText={setText}
              user={user}
              background={background}
              setBackground={setBackground}
              setEmojiPicker={setEmojiPicker}
              emoji={emoji}
            />
          </>
        ) : (
          <ImagePreview
            images={images}
            setImages={setImages}
            text={text}
            setText={setText}
            user={user}
            setShowPrev={setShowPrev}
            setError={setError}
          />
        )}
        <AddtoYourPost setShowPrev={setShowPrev} />
        <button
          className="post_submit"
          onClick={() => {
            postSubmit();
          }}
          disabled={loading}
        >
          {loading ? <PulseLoader color="#fff" size="5px" /> : "Post"}
        </button>
      </div>
    </div>
  );
};

export default CreatePostPopup;
