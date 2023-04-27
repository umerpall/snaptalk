import { useSelector } from "react-redux";
import CreatePost from "../../components/CreatePost";
import { Header } from "../../components/header";
import SendVerification from "../../components/header/sendVerification";
import Post from "../../components/post";
import "./style.css";
import { HashLoader } from "react-spinners";
import Feedback from "../../components/Feedback";
import { useEffect, useState } from "react";

export const Home = ({ setVisible, posts, loading, getAllPosts }) => {
  const { user } = useSelector((state) => ({ ...state }));
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    getAllPosts();
  }, []);

  return (
    <div>
      <Header page="home" setShowFeedback={setShowFeedback} />
      {showFeedback && (
        <Feedback
          user={user._id}
          token={user.token}
          setShowFeedback={setShowFeedback}
        />
      )}
      <div className="topbar">
        {user.verified === false && <SendVerification user={user} />}
      </div>
      <div className="main_home_area">
        <div className="left_home">
          <CreatePost user={user} setVisible={setVisible} />
        </div>
        <div className="right_home">
          {loading ? (
            <div className="skeleton_loader skeleton_loader_home">
              <HashLoader color="#ffb100" />
            </div>
          ) : (
            <>
              <div className="posts">
                {posts.map((post, i) => (
                  <Post user={user} key={i} post={post} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
