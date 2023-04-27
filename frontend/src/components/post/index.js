import { Link } from "react-router-dom";
import Moment from "react-moment";
import "./style.css";
import { Dots, Public } from "../../svg";
import ReactsPopup from "./ReactsPopup";
import { useEffect, useRef, useState } from "react";
import CreateComment from "./CreateComment";
import PostMenu from "./PostMenu";
import useClickOutside from "../../helpers/clickOutside";
import { getReacts, reactPost } from "../../functions/post";
import Comments from "./Comments";

const Post = ({ post, user, profile }) => {
  const [visible, setVisible] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [reacts, setReacts] = useState();
  const [currentReact, setCurrentReact] = useState();
  const [totalReact, setTotalReact] = useState(0);
  const [comments, setComments] = useState([]);
  const [count, setCount] = useState(1);
  const [checkSaved, setCheckSaved] = useState();
  const menuRef = useRef(null);
  useClickOutside(menuRef, () => {
    setShowMenu(false);
  });
  useEffect(() => {
    getPostReacts();
  }, [post]);

  useEffect(() => {
    setComments(post?.comments);
  }, [post]);

  const getPostReacts = async () => {
    const res = await getReacts(post?._id, user.token);
    setReacts(res.reacts);
    setCurrentReact(res.currentReact);
    setTotalReact(res.total);
    setCheckSaved(res.checkSaved);
  };
  const reactHandler = async (type) => {
    if (currentReact == type) {
      setCurrentReact();
      let index = reacts.findIndex((x) => x.react == currentReact);
      if (index !== -1) {
        setReacts([...reacts, (reacts[index].count = --reacts[index].count)]);
        setTotalReact((prev) => --prev);
      }
    } else {
      setCurrentReact(type);
      let index = reacts.findIndex((x) => x.react == type);
      let index1 = reacts.findIndex((x) => x.react == currentReact);
      if (index !== -1) {
        setReacts([...reacts, (reacts[index].count = ++reacts[index].count)]);
        setTotalReact((prev) => ++prev);
      }
      if (index1 !== -1) {
        setReacts([...reacts, (reacts[index1].count = --reacts[index1].count)]);
        setTotalReact((prev) => --prev);
      }
    }
    reactPost(post._id, type, user.token);
  };

  const showMore = () => {
    setCount((prev) => prev + 3);
  };

  const postRef = useRef(null);

  return (
    <div
      className="post"
      style={{ width: `${profile && "100%"}` }}
      ref={postRef}
    >
      <div className="post_header">
        <Link
          to={`/profile/${post?.user.username}`}
          className="post_header_left"
        >
          <img src={post?.user.picture} alt="Profile" />
          <div className="header_col">
            <div className="post_profile_name">
              <div>
                {post?.user.first_name} {post?.user.last_name}
              </div>
              <div className="update_p">
                {post?.type === "profilePicture" &&
                  ` updated ${
                    post?.user.gender === "male" ? "his" : "her"
                  } profile picture`}
                {post?.type === "cover" &&
                  ` updated ${
                    post?.user.gender === "male" ? "his" : "her"
                  } cover picture`}
              </div>
            </div>
            <div className="post_profile_date">
              <Moment fromNow interval={30}>
                {post?.createdAt}
              </Moment>
              <Public color="#828387" />
            </div>
          </div>
        </Link>
        <div
          className="post_header_right hover1"
          onClick={() => setShowMenu((prev) => !prev)}
        >
          <Dots color="#828387" />
        </div>
      </div>
      {post?.background ? (
        <div
          className="post_bg"
          style={{ backgroundImage: `url(${post?.background})` }}
        >
          <div className="post_bg_text">{post?.text}</div>
        </div>
      ) : post?.type === null ? (
        <>
          <div className="post_text">{post?.text}</div>
          {post?.images && post?.images.length && (
            <div
              className={
                post?.images.length === 1
                  ? "grid_1"
                  : post?.images.length === 2
                  ? "grid_2"
                  : post?.images.length === 3
                  ? "grid_3"
                  : post?.images.length === 4
                  ? "grid_4"
                  : post?.images.length >= 5 && "grid_5"
              }
            >
              {post?.images.slice(0, 5).map((image, i) => (
                <img
                  src={image.url}
                  alt="Post"
                  key={i}
                  className={`img-${i}`}
                />
              ))}
              {post?.images.length > 5 && (
                <div className="more_pics_shadow">
                  +{post?.image.length - 5}
                </div>
              )}
            </div>
          )}
        </>
      ) : post?.type === "profilePicture" ? (
        <div className="post_profile_wrap">
          <div className="post_updated_bg">
            <img src={post?.user.cover} />
          </div>
          <img
            src={post?.images[0].url}
            alt="Profile"
            className="post_updated_picture"
          />
        </div>
      ) : (
        <div className="post_cover_wrap">
          <img src={post?.images[0].url} alt="Post" />
        </div>
      )}
      <div className="post_infos">
        <div className="reacts_count">
          <div className="reacts-count_imgs">
            {reacts &&
              reacts
                .sort((a, b) => {
                  return b.count - a.count;
                })
                .slice(0, 3)
                .map(
                  (react, i) =>
                    react.count > 0 && (
                      <img
                        src={`../../../reacts/${react.react}.svg`}
                        alt=""
                        key={i}
                        style={{ width: "18px" }}
                      />
                    )
                )}
          </div>
          <div className="reacts-count_num">{totalReact > 0 && totalReact}</div>
        </div>
        <div className="to_right">
          <div className="comments_count">{comments?.length} comments</div>
        </div>
      </div>
      <div className="post_actions">
        <ReactsPopup
          visible={visible}
          setVisible={setVisible}
          reactHandler={reactHandler}
        />
        <div
          className="post_action hover1"
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
          onClick={() => reactHandler(currentReact ? currentReact : "like")}
        >
          {currentReact ? (
            <img
              src={`../../../reacts/${currentReact}.svg`}
              alt=""
              className="small_react"
              style={{ width: "18px" }}
            />
          ) : (
            <i className="like_icon"></i>
          )}
          <span
            style={{
              color: `${
                currentReact === "like"
                  ? "#4267b2"
                  : currentReact === "love"
                  ? "#f63459"
                  : currentReact === "haha"
                  ? "#f7b125"
                  : currentReact === "sad"
                  ? "#f7b125"
                  : currentReact === "wow"
                  ? "#f7b125"
                  : currentReact === "angry"
                  ? "#e4605a"
                  : ""
              }`,
            }}
          >
            {currentReact ? currentReact : "like"}
          </span>
        </div>
        <div className="post_action hover1">
          <i className="comment_icon"></i>
          <span>Comment</span>
        </div>
      </div>
      <div className="comments_wrap">
        <div className="comments_order"></div>
        <CreateComment
          user={user}
          postId={post?._id}
          setComments={setComments}
          setCount={setCount}
        />
        {comments &&
          comments
            .sort((a, b) => {
              return new Date(b.commentAt) - new Date(a.commentAt);
            })
            .slice(0, count)
            .map((comment, i) => (
              <Comments
                userId={user.id}
                postId={post?._id}
                token={user.token}
                comment={comment}
                setComments={setComments}
                key={i}
              />
            ))}

        {count < comments?.length && (
          <div className="view_comments" onClick={showMore}>
            View more Comments
          </div>
        )}
      </div>
      {showMenu && (
        <div ref={menuRef}>
          <PostMenu
            userId={user.id}
            postUserId={post?.user._id}
            imagesLength={post?.images?.length}
            postId={post?._id}
            token={user.token}
            checkSaved={checkSaved}
            setCheckSaved={setCheckSaved}
            images={post?.images}
            postRef={postRef}
          />
        </div>
      )}
    </div>
  );
};

export default Post;
