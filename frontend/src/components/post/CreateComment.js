import { useState, useEffect, useRef } from "react";
import EmojiPicker from "emoji-picker-react";
import useClickOutside from "../../helpers/clickOutside";
import { comment } from "../../functions/post";
import dataURItoBlob from "../../helpers/dataURItoBlob";
import { uploadImages } from "../../functions/uploadImages";
import { ClipLoader } from "react-spinners";

const CreateComment = ({ user, postId, setComments, setCount }) => {
  const [picker, setPicker] = useState(false);
  const [text, setText] = useState("");
  const [commentImage, setCommentImage] = useState("");
  const [error, setError] = useState("");
  const [cursorPosition, setCursorPosition] = useState();
  const [loading, setLoading] = useState(false);
  const textRef = useRef(null);
  const imgRef = useRef(null);
  const emojiClickOutsideRef = useRef(null);

  useEffect(() => {
    textRef.current.selectionEnd = cursorPosition;
  }, [cursorPosition]);

  useClickOutside(emojiClickOutsideRef, () => {
    setPicker(false);
  });

  const handleEmoji = ({ emoji }) => {
    const ref = textRef.current;
    ref.focus();
    const start = text.substring(0, ref.selectionStart);
    const end = text.substring(ref.selectionStart);
    const newText = start + emoji + end;
    setText(newText);
    setCursorPosition(start.length + emoji.length);
  };

  const handleImage = (e) => {
    let file = e.target.files[0];
    if (
      file.type !== "image/jpeg" &&
      file.type !== "image/png" &&
      file.type !== "image/webp" &&
      file.type !== "image/gif"
    ) {
      setError(`${file.name} format is not supported.`);
      return;
    } else if (file.size > 1024 * 1024 * 3) {
      setError(`${file.name} size is too large. Max 3MB is allowed.`);
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      setCommentImage(event.target.result);
    };
  };
  const handleComment = async (e) => {
    if (e.key === "Enter") {
      if (commentImage != "") {
        setLoading(true);
        const img = dataURItoBlob(commentImage);
        const path = `${user.username}/post_images/${postId}/comment`;
        let formData = new FormData();
        formData.append("path", path);
        formData.append("file", img);
        const imgComment = await uploadImages(formData, path, user.token);
        const comments = await comment(
          postId,
          text,
          imgComment[0].url,
          user.token
        );

        setComments(comments);
        setCount((prev) => ++prev);
        setLoading(false);
        setText("");
        setCommentImage("");
      } else {
        setLoading(true);
        const comments = await comment(postId, text, "", user.token);
        setComments(comments);
        setCount((prev) => ++prev);
        setLoading(false);
        setText("");
        setCommentImage("");
      }
    }
  };
  return (
    <div className="create_comment_wrap">
      <div className="create-comment">
        <img src={user.picture} alt={`${user.first_name}'s profile`} />
        <div className="comment_input_wrap">
          {picker && (
            <div
              className="under_comment_emoji_picker"
              ref={emojiClickOutsideRef}
            >
              <EmojiPicker onEmojiClick={handleEmoji} />
            </div>
          )}
          <input
            type="file"
            hidden
            ref={imgRef}
            accept="image/jpeg, image/png, image/webp, image/gif"
            onChange={handleImage}
          />
          {error && (
            <div className="comment_error">
              <div className="postError_error">{error}</div>
              <button className="yellow_btn" onClick={() => setError("")}>
                Try again
              </button>
            </div>
          )}
          <input
            type="text"
            ref={textRef}
            value={text}
            placeholder="Write a comment..."
            onChange={(e) => setText(e.target.value)}
            onKeyUp={handleComment}
          />
          <div className="comment_circle_icon">
            <ClipLoader color="#ffb100" size={20} loading={loading} />
          </div>
          <div
            className="comment_circle_icon hover2"
            onClick={() => setPicker((prev) => !prev)}
          >
            <i className="emoji_icon"></i>
          </div>
          <div
            className="comment_circle_icon hover2"
            onClick={() => imgRef.current.click()}
          >
            <i className="camera_icon"></i>
          </div>
        </div>
      </div>
      {commentImage && (
        <div className="comment_img_preview">
          <img src={commentImage} alt="Comment" />
          <div
            className="small_white_circle"
            onClick={() => setCommentImage("")}
          >
            <i className="exit_icon"></i>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateComment;
