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
    <FormControl sx={{m: 1.5, maxWidth: '215px'}} size="small" fullWidth={true}>
      <Select
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
