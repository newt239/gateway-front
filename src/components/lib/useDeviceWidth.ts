import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const useDeviceWidth = () => {
  const theme = useTheme();
  const largerThanSM = useMediaQuery(theme.breakpoints.up("sm"));
  const largerThanMD = useMediaQuery(theme.breakpoints.up("md"));
  return { largerThanSM, largerThanMD };
};

export default useDeviceWidth;