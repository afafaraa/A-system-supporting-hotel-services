import React from "react";
import { useTranslation } from 'react-i18next';
import {MenuItem, Select, SelectChangeEvent, Stack} from "@mui/material";

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const handleChange = (event: SelectChangeEvent) => {
    i18n.changeLanguage(event.target.value).then(() => null);
  };

  const languageBox = (language: string, code: string) => {
    return (
      <Stack direction="row" gap={1} alignItems="center">
        {/* Flags from the page: https://flagcdn.com/40x30/... */}
        <img alt={`${code} flag`} src={`/flags/${code}.png`} height="20px" />
        {language}
      </Stack>
    )
  }

  return (
    <Select sx={{minWidth: '170px', maxWidth: '215px', flexGrow: 1, height: "2.5rem", bgcolor: "background.paper"}}
            id="demo-simple-select"
            value={i18n.language}
            onChange={handleChange}
    >
      <MenuItem value={"en"}>{languageBox("English", "gb")}</MenuItem>
      <MenuItem value={"pl"}>{languageBox("Polski", "pl")}</MenuItem>
    </Select>
  );
};

export default LanguageSwitcher;
