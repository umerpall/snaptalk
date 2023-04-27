import "./style.css";
import { Photo, Feeling } from "../../svg";

const CreatePost = ({ user, setVisible, profile }) => {
  return (
    <div
      className="create_post"
      style={{
        width: `${profile && "100%"}`,
        margin: `${profile && "1rem 0"}`,
      }}
    >
      <div className="create_post_header">
        <img src={user?.picture} alt="Profile" />
        <div className="open_post hover2" onClick={() => setVisible(true)}>
          What's on your mind, {user?.first_name}?
        </div>
      </div>
      <div className="create_splitter"></div>
      <div className="create_post_body">
        <div
          className="create_post_icon hover1"
          onClick={() => setVisible(true)}
        >
          <Photo color="#4bb467" />
          Photo
        </div>
        <div
          className="create_post_icon hover1"
          onClick={() => setVisible(true)}
        >
          <Feeling color="#f7b928" />
          Feeling/Activity
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
