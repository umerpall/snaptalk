import { Photo } from "../../svg";

const AddtoYourPost = ({ setShowPrev }) => {
  return (
    <div
      className="add_to_your_post"
      onClick={() => {
        setShowPrev(true);
      }}
    >
      <div className="add_photo_icon">
        <Photo color="#45bd62" />
      </div>
      <div className="add_to_text">Add photos to your post</div>
    </div>
  );
};

export default AddtoYourPost;
