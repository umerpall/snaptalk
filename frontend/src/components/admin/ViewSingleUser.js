const ViewSingleUser = ({
  singleUserRecord_feedbacks,
  setShowSingleFeedback,
  user,
  type,
}) => {
  return (
    <div className="view_single_user">
      <div className="feedback_user_bio">
        <i
          className="arrow_back_icon"
          onClick={() => setShowSingleFeedback(0)}
        ></i>
        <img src={user.picture} />
        {user.first_name} {user.last_name}
      </div>
      <div>
        {singleUserRecord_feedbacks.map((feedback, i) => (
          <div className="single_feedback" key={i}>
            <h4>{type === "feedback" ? feedback.feedback : feedback.log}</h4>
            <p>
              {feedback.createdAt.slice(11, 16)}
              {"  -  "}
              {feedback.createdAt.slice(0, 10)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewSingleUser;
