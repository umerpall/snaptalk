import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="login_footer">
      <div className="login_footer_wrap">
        <Link to="/">Sign up</Link>
        <Link to="/">Login</Link>
        <Link to="/">Messenger</Link>
        <Link to="/">Facebook</Link>
        <Link to="/">Watch</Link>
        <Link to="/">Places</Link>
        <Link to="/">Marketplace</Link>
        <Link to="/">Instagram</Link>
        <Link to="/">Services</Link>
        <Link to="/">About</Link>
        <Link to="/">Create Page</Link>
        <Link to="/">Privacy</Link>
        <Link to="/">Cookies</Link>
        <Link to="/">Terms</Link>
        <Link to="/">Help</Link>
      </div>
      <div
        className="login_footer_wrap"
        style={{ fontSize: "12px", marginTop: "10px" }}
      >
        <Link to="/">Muhammad Umer Pall &copy; 2023</Link>
      </div>
    </footer>
  );
};
