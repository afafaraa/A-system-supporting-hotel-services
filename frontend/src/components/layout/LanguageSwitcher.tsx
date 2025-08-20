import React from "react";
import { useTranslation } from 'react-i18next';
import {FormControl, MenuItem, Select, SelectChangeEvent, Stack} from "@mui/material";

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const handleChange = (event: SelectChangeEvent) => {
    i18n.changeLanguage(event.target.value);
  };

  const languageBox = (language: string, code: string) => {
    return (
      <Stack direction="row" gap={1} alignItems="center">
        <img alt={`${code} flag`} src={`https://flagcdn.com/40x30/${code}.png`} height="20px" />
        {language}
      </Stack>
    )
  }

  return (
    <FormControl sx={{maxWidth: '215px', borderRadius: 2, boxShadow: theme => `0px 0px 20px 2px ${theme.palette.background.shadow}`}}
                 size="small" fullWidth={true}>
      <Select sx={{'& .MuiOutlinedInput-notchedOutline': {border: theme => `1px solid ${theme.palette.background.shadow}`, borderRadius: 2}}}
        id="demo-simple-select"
        value={i18n.language}
        onChange={handleChange}
      >
        <MenuItem value={"en"}>{languageBox("English", "gb")}</MenuItem>
        <MenuItem value={"pl"}>{languageBox("Polski", "pl")}</MenuItem>
      </Select>
    </FormControl>
  );
};

export default LanguageSwitcher;
