import { useState } from "react";
import Bio from "./Bio";

const Detail = ({
  img,
  value,
  placeholder,
  name,
  handleChange,
  updateDetails,
  text,
  infos,
  rel,
}) => {
  const [show, setShow] = useState(false);
  return (
    <div>
      <div className="add_details_flex" onClick={() => setShow(true)}>
        {value ? (
          <div className="info_profile">
            <img src={`../../../icons/${img}.png`} alt="Personal Info" />
            {value}
            <i className="edit_icon"></i>
          </div>
        ) : (
          <>
            <i className="rounded_plus_icon"></i>
            <span className="underline">{text}</span>
          </>
        )}
      </div>
      {show && (
        <Bio
          placeholder={placeholder}
          name={name}
          handleChange={handleChange}
          updateDetails={updateDetails}
          setShow={setShow}
          infos={infos}
          detail
          rel={rel}
        />
      )}
    </div>
  );
};

export default Detail;
