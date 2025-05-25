import React from "react";
import { useTranslation } from 'react-i18next';
import {FormControl, InputLabel, MenuItem, Select, SelectChangeEvent} from "@mui/material";

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const handleChange = (event: SelectChangeEvent) => {
    i18n.changeLanguage(event.target.value);
  };

  return (
    <FormControl variant='standard' sx={{m: 1.5, width: '215px'}}>
      <InputLabel id="demo-simple-select-label">Language</InputLabel>
      <Select
        id="demo-simple-select"
        value={i18n.language}
        label="Language"
        onChange={handleChange}
      >
        <MenuItem value={'en'}>🇺🇸 English</MenuItem>
        <MenuItem value={'pl'}>🇵🇱 Polski</MenuItem>
      </Select>
    </FormControl>
  );
};

export default LanguageSwitcher;
