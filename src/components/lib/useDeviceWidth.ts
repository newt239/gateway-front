import { useMediaQuery } from "@mui/material";
import { Theme } from "@mui/material/styles";


const useDeviceWidth = () => {
  const largerThanSM = useMediaQuery((theme: Theme) => theme.breakpoints.up("sm"));
  const largerThanMD = useMediaQuery((theme: Theme) => theme.breakpoints.up("md"));
  return { largerThanSM, largerThanMD };
};

export default useDeviceWidth;