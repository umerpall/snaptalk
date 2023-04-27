const MenuItem = ({ icon, title, subTitle }) => {
  return (
    <li className="hover1">
      <i className={icon}></i>
      <span>{title}</span>
    </li>
  );
};

export default MenuItem;
