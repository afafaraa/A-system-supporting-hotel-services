import { useEffect, useState, useMemo } from "react";
import { axiosAuthApi } from "../../middleware/axiosApi";
import {
  Box,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Chip,
  CircularProgress,
  ClickAwayListener,
} from "@mui/material";
import {
  Add,
  Edit,
  DeleteOutline,
  Search,
} from "@mui/icons-material";
import RoomServiceOutlinedIcon from '@mui/icons-material/RoomServiceOutlined';
import ServiceFormModal from "./modals/ServiceFormModal";
import ServiceDeleteModal from "./modals/ServiceDeleteModal";
import { Service } from "../../types";
import { useTranslation } from "react-i18next";
import { SectionCard } from "../../theme/styled-components/SectionCard";
import { ServiceCard } from "../../theme/styled-components/ServiceCard";
import SectionTitle from "../../components/ui/SectionTitle.tsx";
import ServiceIcon from "../../components/ui/ServiceIcon.tsx";

function ServicesListPage() {
  const { t } = useTranslation();
  const tc = (key: string) => t(`pages.manager.services_list.${key}`);
  const [allServices, setAllServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Service | undefined>(undefined);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [filterName, setFilterName] = useState("");
  const [filterAvailability, setFilterAvailability] = useState<
    "all" | "true" | "false"
  >("all");
  const [filterType, setFilterType] = useState<
    "ALL" | "GENERAL_SERVICE" | "PLACE_RESERVATION"
  >("ALL");
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    // TO DO: add pagination
    axiosAuthApi
      .get<Service[]>("/services/available")
      .then((res) => setAllServices(res.data))
      .catch(() => setError("Failed to fetch services"))
      .finally(() => setLoading(false));
  }, []);

  const filteredServices = useMemo(() => {
    return allServices.filter((s) => {
      if (
        filterName &&
        !s.name.toLowerCase().includes(filterName.toLowerCase())
      ) {
        return false;
      }
      if (filterAvailability !== "all") {
        const isUnavailable = s.disabled;
        if (filterAvailability === "true" && !isUnavailable) return false;
        if (filterAvailability === "false" && isUnavailable) return false;
      }
      return !(filterType !== "ALL" && s.type !== filterType);
    });
  }, [allServices, filterName, filterAvailability, filterType]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }
  if (error) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <SectionCard>
      <Box
        display="flex"
        alignItems="center"
        flexWrap="wrap"
        gap={2}
        mb={3}
      >
        <SectionTitle title={<><RoomServiceOutlinedIcon /> {tc("title")}</>}
                      subtitle={tc("subtitle")} mb={0}/>

        <Box
          display="flex"
          alignItems="center"
          flexWrap="wrap"
          gap={2}
          justifyContent="flex-end"
          flexGrow={1}
        >
          <ClickAwayListener onClickAway={() => setSearchOpen(false)}>
            <Box display="grid" alignItems="center" position="relative"
                 gridTemplateColumns={`auto ${searchOpen ? "1fr" : "0fr"}`} columnGap={searchOpen ? 1 : 0}
                 sx={{transition: "grid-template-columns 0.3s ease, column-gap 0.3s ease"}}>
              <IconButton onClick={() => setSearchOpen(!searchOpen)}>
                <Search />
              </IconButton>
              <TextField
                placeholder={tc("search_placeholder")}
                variant="outlined"
                size="small"
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
                sx={{
                  visibility: searchOpen ? "visible" : "hidden",
                }}
                autoFocus
              />
            </Box>
          </ClickAwayListener>

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel id="availability-label">
              {tc("availability")}
            </InputLabel>
            <Select
              labelId="availability-label"
              label={tc("availability")}
              value={filterAvailability}
              onChange={(e) =>
                setFilterAvailability(
                  e.target.value as "all" | "true" | "false"
                )
              }
            >
              <MenuItem value="all">{tc("all")}</MenuItem>
              <MenuItem value="true">{tc("unavailable")}</MenuItem>
              <MenuItem value="false">{tc("available")}</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel id="type-label">{tc("type")}</InputLabel>
            <Select
              labelId="type-label"
              label={tc("type")}
              value={filterType}
              onChange={(e) =>
                setFilterType(
                  e.target.value as
                  | "ALL"
                  | "GENERAL_SERVICE"
                  | "PLACE_RESERVATION"
                )
              }
            >
              <MenuItem value="ALL">{tc("all")}</MenuItem>
              <MenuItem value="GENERAL_SERVICE">
                {tc("generalService")}
              </MenuItem>
              <MenuItem value="PLACE_RESERVATION">
                {tc("placeReservation")}
              </MenuItem>
            </Select>
          </FormControl>

          <Button
            sx={{borderRadius: '12px'}}
            variant="contained"
            startIcon={<Add />}
            onClick={() => {
              setEditing(undefined);
              setModalOpen(true);
            }}
          >
            {tc("addService")}
          </Button>
        </Box>
      </Box>

      {filteredServices.map((s) => (
        <ServiceCard key={s.id}>
          <Box display="flex" alignItems="center" gap={2}>
            <ServiceIcon imageUrl={s.image} imageAlt={s.name + " image"}>
              <Typography fontWeight="bold">{s.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {s.description}
              </Typography>
              <Box display="flex" alignItems="center" gap={2} mt={0.5}>
                <Typography variant="body2" fontWeight="bold">
                  {s.price == 0.0 ? '— ' : s.price.toFixed(2)}$
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {s.duration} min
                </Typography>
                <Chip
                  label={s.disabled ? tc("unavailable") : tc("available")}
                  color={s.disabled ? "default" : "primary"}
                  size="small"
                  sx={{ fontWeight: "bold" }}
                />
              </Box>
            </ServiceIcon>
          </Box>

          <Box display="flex" gap={1} flexGrow={1} justifyContent="flex-end">
            <IconButton
              color="primary"
              onClick={() => {
                setEditing(s);
                setModalOpen(true);
              }}
              sx={{
                border: 1,
                borderColor: "primary.main",
                borderRadius: 1,
                width: 40,
                height: 40,
                p: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Edit />
            </IconButton>
            <IconButton
              color="error"
              onClick={() => {
                setEditing(s);
                setDeleteOpen(true);
              }}
              sx={{
                border: 1,
                borderColor: "red",
                borderRadius: 1,
                width: 40,
                height: 40,
                p: 1,
                mx: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <DeleteOutline />
            </IconButton>
          </Box>
        </ServiceCard>
      ))}

      <ServiceFormModal
        open={modalOpen}
        initial={editing}
        onClose={() => setModalOpen(false)}
        onSaved={(svc) => {
          setAllServices((prev) => {
            if (svc.id) {
              const idx = prev.findIndex((x) => x.id === svc.id);
              if (idx >= 0) {
                const copy = [...prev];
                copy[idx] = svc;
                return copy;
              }
            }
            return [svc, ...prev];
          });
        }}
      />

      <ServiceDeleteModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={async (deleteOption) => {
          if (!editing) return;

          try {
            await axiosAuthApi.delete(
              `/services/${editing.id}?deleteOption=${deleteOption}`
            );

            setAllServices((prev) => prev.filter((s) => s.id !== editing.id));
          } catch (err) {
            console.error("Failed to delete service:", err);
          } finally {
            setDeleteOpen(false);
          }
        }}
      />
    </SectionCard>
  );
}

export default ServicesListPage;
