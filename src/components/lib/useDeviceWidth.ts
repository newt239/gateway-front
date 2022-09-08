import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const useDeviceWidth = () => {
  const theme = useTheme();
  const largerThanSM = useMediaQuery(theme.breakpoints.up("sm"));
  const largerThanMD = useMediaQuery(theme.breakpoints.up("md"));
  const largerThanLG = useMediaQuery(theme.breakpoints.up("lg"));
  return { largerThanSM, largerThanMD, largerThanLG };
};

export default useDeviceWidth;
