import { memo } from "react";
import { Tooltip, tooltipClasses } from "@mui/material";
import { styled } from "@mui/material/styles";

const CustomTooltip = ({ children, direction, title }) => {
  const BootstrapTooltip = styled(({ className, ...props }) => <Tooltip {...props} arrow classes={{ popper: className }} />)(({ theme }) => ({
    [`& .${tooltipClasses.arrow}`]: {
      color: theme.palette.common.black,
      fontSize: "6px",
      marginTop: "-4px",
    },
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: theme.palette.common.black,
      borderRadius: 0,
      marginTop: "1px",
    },
  }));

  if (!title) {
    return children;
  }

  return (
    <BootstrapTooltip
      title={title}
      placement={direction}
      PopperProps={{
        style: { zIndex: 9999, position: "fixed" },
      }}
    >
      <span>{children}</span>
    </BootstrapTooltip>
  );
};

export default memo(CustomTooltip);
