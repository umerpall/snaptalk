const Bio = ({
  infos,
  max,
  setShowBio,
  updateDetails,
  placeholder,
  name,
  handleChange,
  detail,
  setShow,
  rel,
}) => {
  return (
    <div className="add_bio_wrap">
      {rel ? (
        <select
          className="select_rel"
          name={name}
          value={infos?.relationship}
          onChange={handleChange}
        >
          <option value="Single">Single</option>
          <option value="Married">Married</option>
          <option value="Divorced">Divorced</option>
        </select>
      ) : (
        <textarea
          placeholder={placeholder}
          name={name}
          value={infos?.[name]}
          maxLength={detail ? 60 : 100}
          className="textarea_yellow details_input"
          onChange={handleChange}
        ></textarea>
      )}
      {!detail && <div className="remaining">{max} characters remaining</div>}
      <div className="flex">
        <button
          className="gray_btn"
          onClick={() => {
            !detail ? setShowBio(false) : setShow(false);
          }}
        >
          Cancel
        </button>
        <button
          className="yellow_btn"
          onClick={() => {
            updateDetails();
            setShow(false);
          }}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default Bio;
