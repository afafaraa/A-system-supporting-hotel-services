import LanguageSwitcher from "../ui/LanguageSwitcher.tsx";
import Box from "@mui/system/Box";

function TemporaryMenu() {
  return (
    <Box position="fixed" bottom={4} left={4} sx={{opacity: 0, "&:hover": {opacity: 1}}}>
      <LanguageSwitcher />
    </Box>
  );
}

export default TemporaryMenu;
