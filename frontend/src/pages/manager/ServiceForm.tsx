import { useState, useEffect } from "react";
import { Service, WeekdayHour } from "../../types/service";
import { axiosAuthApi } from "../../middleware/axiosApi";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, InputLabel, MenuItem, Select, Switch, TextField } from "@mui/material";
import { Box } from "@mui/system";

type Props = {
    open: boolean;
    initial?: Service;
    onClose: () => void;
    onSaved: (service: Service) => void;
}

function ServiceForm({ open, initial, onClose, onSaved }: Props) {
    const isEdit = Boolean(initial?.id);
    const [form, setForm] = useState<Service>({
        name: "",
        description: "",
        price: 0,
        type: "GENERAL_SERVICE",
        disabled: false,
        maxAvailable: 0,
        weekday: [],
        image: "",
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (initial) setForm(initial);
    }, [initial]);

    const handleChange = (k: keyof Service, v: any) => {
        setForm((prev) => ({...prev, [k]: v}));
    }

    const changeWeekday = (index: number, k: keyof WeekdayHour, v: any) => {
        const newWeekday = [...form.weekday];
        newWeekday[index] = {...newWeekday[index], [k]: v};
        setForm((prev) => ({...prev, weekday: newWeekday}));
    };

    const addWeekday = () => {
        setForm((prev) => ({
            ...prev,
            weekday: [...(prev.weekday ?? []), { day: "MONDAY", startHour: 0, endHour: 0 }]
        }));
    };

    const removeWeekday = (index: number) => {
        setForm((prev) => ({
            ...prev,
            weekday: prev.weekday.filter((_, i) => i !== index)
        }));
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const url = isEdit ? `/services/${initial?.id}` : "/services";
            const method = isEdit ? "patch" : "post";
            const res = await axiosAuthApi[method]<Service>(url, form);
            onSaved(res.data);
            onClose();
        } catch (e) {
            console.error(e);
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{isEdit ? "Edit Service" : "Add Service"}</DialogTitle>
            <DialogContent>
                <Box
                    component="form"
                    id="service-form"
                    display="flex"
                    flexDirection="column"
                    gap={2}
                    mt={1}
                >
                    <TextField
                        label="Name"
                        value={form.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        required
                    />
                    <TextField
                        label="Description"
                        value={form.description}
                        onChange={(e) => handleChange("description", e.target.value)}
                        multiline
                        rows={4}
                    />
                    <TextField
                        label="Price"
                        type="number"
                        value={form.price}
                        onChange={(e) => handleChange("price", parseFloat(e.target.value))}
                        required
                    />
                    <TextField
                        label="Max Available"
                        type="number"
                        value={form.maxAvailable}
                        onChange={(e) => handleChange("maxAvailable", parseInt(e.target.value))}
                    />
                    <FormControl>
                        <InputLabel>Type</InputLabel>
                        <Select
                            label="Type"
                            value={form.type}
                            onChange={(e) => handleChange("type", e.target.value)}
                        >
                            <MenuItem value="GENERAL_SERVICE">General Service</MenuItem>
                            <MenuItem value="PLACE_RESERVATION">Place Reservation</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={form.disabled}
                                onChange={(e) => handleChange("disabled", e.target.checked)}
                            />
                        }
                        label= {form.disabled ? "Disabled" : "Available"}
                    />
                    <TextField
                        label="Image URL"
                        value={form.image}
                        onChange={(e) => handleChange("image", e.target.value)}
                    />
                    <Box>
                        <Button onClick={addWeekday} variant="outlined">Add weekday</Button>
                        {Array.isArray(form.weekday) && form.weekday.map((wd, index) => (
                            <Box key={index} display="flex" gap={2} alignItems="center" mt={3}>
                                <FormControl>
                                    <InputLabel id={`weekday-day-label-${index}`}>Day</InputLabel>
                                    <Select
                                        labelId={`weekday-day-label-${index}`}
                                        label="Day"
                                        value={wd.day}
                                        onChange={(e) => changeWeekday(index, "day", e.target.value)}
                                    >
                                        {[
                                            "MONDAY",
                                            "TUESDAY",
                                            "WEDNESDAY",
                                            "THURSDAY",
                                            "FRIDAY",
                                            "SATURDAY",
                                            "SUNDAY"
                                        ].map(d => (
                                            <MenuItem key={d} value={d}>
                                                {d}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <TextField
                                    label="Start Hour"
                                    type="time"
                                    value={wd.startHour.toString().padStart(2, "0") + ":00"}
                                    onChange={(e) => {
                                        const hour = parseInt(e.target.value.split(":")[0], 10);
                                        changeWeekday(index, "startHour", hour);
                                    }}
                                />
                                <TextField
                                    label="End Hour"
                                    type="time"
                                    value={wd.endHour.toString().padStart(2, "0") + ":00"}
                                    onChange={(e) => {
                                        const hour = parseInt(e.target.value.split(":")[0], 10);
                                        changeWeekday(index, "endHour", hour);
                                    }}
                                />
                                <Button variant="outlined" color="error" onClick={() => removeWeekday(index)}>
                                    Remove
                                </Button>
                            </Box>
                        ))}
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={saving}>Cancel</Button>
                <Button form="service-form" type="submit" variant="contained" color="primary" disabled={saving} onClick={handleSubmit}>
                    {saving ? "Saving..." : isEdit ? "Save" : "Create"}
                </Button>
            </DialogActions>
        </Dialog>
    );

}

export default ServiceForm;