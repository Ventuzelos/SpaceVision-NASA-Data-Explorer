import { Icons } from "../../../constants/icons";

import "./Icon.css";

function Icon({
  name,
  size = 18,
  strokeWidth = 2,
  className = "",
  color,
}) {
  const LucideIcon = Icons[name];

  if (!LucideIcon) return null;

  return (
    <LucideIcon
      size={size}
      strokeWidth={strokeWidth}
      color={color}
      className={`icon ${className}`}
    />
  );
}

export default Icon;