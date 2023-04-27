import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";

const DigitalAccessibility = ({ setVisible }) => {
  const dispatch = useDispatch();
  const { darkTheme } = useSelector((state) => ({ ...state }));
  return (
    <div className="absolute_wrap dark_mode">
      <div className="absolute_wrap_header">
        <div className="circle hover1">
          <i className="arrow_back_icon" onClick={() => setVisible(0)}></i>
        </div>
      </div>
      <div className="menu_main">
        <div className="small_circle">
          <i className="dark_filled_icon"></i>
        </div>
        <div className="menu_col">
          <span className="menu_span1">Dark Mode</span>
          <span className="menu_span2">
            Adjust the appearence of SnapTalk to reduce the glare and give your
            eyes a break.
          </span>
        </div>
      </div>
      <div className="dark_radio_wrap">
        <label
          htmlFor="darkOff"
          className="hover1"
          onClick={() => {
            Cookies.set("darkTheme", false);
            dispatch({ type: "LIGHT" });
          }}
        >
          <span>Off</span>
          {darkTheme ? (
            <input type="radio" name="dark" id="darkOff" />
          ) : (
            <input type="radio" name="dark" id="darkOff" checked />
          )}
        </label>
        <label
          htmlFor="darkOn"
          className="hover1"
          onClick={() => {
            Cookies.set("darkTheme", false);
            dispatch({ type: "DARK" });
          }}
        >
          <span>On</span>
          {darkTheme ? (
            <input type="radio" name="dark" id="darkOn" checked />
          ) : (
            <input type="radio" name="dark" id="darkOn" />
          )}
        </label>
      </div>
    </div>
  );
};

export default DigitalAccessibility;
