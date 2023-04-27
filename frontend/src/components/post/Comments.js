import { useState } from "react";
import Moment from "react-moment";
import { deleteComment } from "../../functions/post";

const Comments = ({ comment, userId, token, postId, setComments }) => {
  const [visitor, setVisitor] = useState(
    comment.commentBy._id !== userId ? true : false
  );
  const deleteCommentHandler = async (commentId) => {
    const deletedComment = await deleteComment(commentId, postId, token);
    setComments((prev) => prev.filter((comment) => comment._id !== commentId));
  };
  return (
    <div className="comment">
      <img
        src={comment.commentBy.picture}
        alt="profile"
        className="comment_img"
      />
      <div className="comment_col">
        <div className="comment_wrap">
          {!visitor && (
            <div
              className="delete"
              onClick={() => deleteCommentHandler(comment._id)}
            >
              <i className="delete_icon"></i>
            </div>
          )}
          <div className="comment_name">
            {comment.commentBy.first_name} {comment.commentBy.last_name}
          </div>
          <div className="comment_text">{comment.comment}</div>
          {comment.image && (
            <img src={comment.image} alt="" className="comment_image" />
          )}
          <div className="comment_time">
            <Moment fromNow interval={60}>
              {comment.commentAt}
            </Moment>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Comments;
