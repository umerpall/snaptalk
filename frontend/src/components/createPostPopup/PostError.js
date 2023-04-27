const PostError = ({ error, setError }) => {
  return (
    <div className="postError">
      <div>{error}</div>
      <button
        onClick={() => {
          setError("");
        }}
        className="yellow_btn"
      >
        Try again
      </button>
    </div>
  );
};

export default PostError;
