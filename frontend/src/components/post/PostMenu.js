import { useState } from "react";
import { deletePost, savePost } from "../../functions/post";
import MenuItem from "./MenuItem";
import { saveAs } from "file-saver";

const PostMenu = ({
  postUserId,
  userId,
  imagesLength,
  token,
  postId,
  checkSaved,
  setCheckSaved,
  images,
  postRef,
}) => {
  const [test, setTest] = useState(postUserId === userId ? true : false);

  const saveHandler = async () => {
    savePost(postId, token);
    if (checkSaved) {
      setCheckSaved(false);
    } else {
      setCheckSaved(true);
    }
  };

  const downloadImages = async () => {
    images.map((img) => {
      saveAs(img.url, "image.jpg");
    });
  };

  const deleteHandler = async () => {
    const res = await deletePost(postId, token);
    if (res.status === "ok") {
      postRef.current.remove();
    }
  };

  return (
    <div className="post_menu">
      <div onClick={() => saveHandler()}>
        {checkSaved ? (
          <MenuItem
            icon="save_icon"
            title="Unsave Post"
            saveHandler={saveHandler}
          />
        ) : (
          <MenuItem
            icon="save_icon"
            title="Save Post"
            saveHandler={saveHandler}
          />
        )}
      </div>
      {imagesLength && (
        <div onClick={() => downloadImages()}>
          <MenuItem icon="download_icon" title="Download" />
        </div>
      )}
      {imagesLength && (
        <MenuItem icon="fullscreen_icon" title="Enter Full Screen" />
      )}
      {test && (
        <div onClick={() => deleteHandler()}>
          <MenuItem icon="trash_icon" title="Move to trash" />
        </div>
      )}
    </div>
  );
};

export default PostMenu;
