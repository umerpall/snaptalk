import { useRef } from "react";
import Detail from "./Detail";
import useClickOutside from "../../helpers/clickOutside";

const EditDetails = ({
  details,
  handleChange,
  updateDetails,
  infos,
  setVisible,
}) => {
  const editDetailsRef = useRef(null);
  useClickOutside(editDetailsRef, () => setVisible(false));
  return (
    <div className="blur">
      <div className="post_box infos_box" ref={editDetailsRef}>
        <div className="box_header">
          <div className="small_circle" onClick={() => setVisible(false)}>
            <i className="exit_icon"></i>
          </div>
          <span>Edit details</span>
        </div>
        <div className="details_wrapper scrollbar">
          <div className="details_col">
            <span>Customize your Intro</span>
          </div>
          <div className="details_header">Work</div>
          <Detail
            value={details?.job}
            placeholder="Add a job title..."
            img="job"
            name="job"
            text="Add a Job"
            handleChange={handleChange}
            updateDetails={updateDetails}
            infos={infos}
          />
          <Detail
            value={details?.workplace}
            placeholder="Add a workplace..."
            img="job"
            name="workplace"
            text="Add your workplace"
            handleChange={handleChange}
            updateDetails={updateDetails}
            infos={infos}
          />
          <div className="details_header">Education</div>
          <Detail
            value={details?.highSchool}
            placeholder="Add your high school..."
            img="studies"
            name="highSchool"
            text="Add your high school"
            handleChange={handleChange}
            updateDetails={updateDetails}
            infos={infos}
          />
          <Detail
            value={details?.college}
            placeholder="Add a college..."
            img="studies"
            name="college"
            text="Add your college"
            handleChange={handleChange}
            updateDetails={updateDetails}
            infos={infos}
          />
          <div className="details_header">Current City</div>
          <Detail
            value={details?.currentCity}
            placeholder="Add your current city..."
            img="home"
            name="currentCity"
            text="Add your current city"
            handleChange={handleChange}
            updateDetails={updateDetails}
            infos={infos}
          />
          <div className="details_header">Hometown</div>
          <Detail
            value={details?.hometown}
            placeholder="Add your hometown..."
            img="home"
            name="hometown"
            text="Add your hometown"
            handleChange={handleChange}
            updateDetails={updateDetails}
            infos={infos}
          />
          <div className="details_header">Relationship</div>
          <Detail
            value={details?.relationship}
            placeholder="Add your relationship status..."
            img="home"
            name="relationship"
            text="Add your relationship status"
            handleChange={handleChange}
            updateDetails={updateDetails}
            infos={infos}
            rel
          />
        </div>
      </div>
    </div>
  );
};

export default EditDetails;
