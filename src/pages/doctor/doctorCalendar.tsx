import { useState, useMemo } from "react";
import {
  Box,
  Typography,
  Modal,
  Paper,
  Button,
  TextField,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useTranslation } from "react-i18next";
import UserNavigation from "../../components/userComponents/userNavigation";
import { colors } from "../../utils/colors";

interface FreeTime {
  id: string;
  start: string;
  end: string;
  type: "dayOff" | "break";
  reason?: string;
}

export default function DoctorCalendar() {
  const { t } = useTranslation();
  const [loading] = useState(false);
  const [freeTimes, setFreeTimes] = useState<FreeTime[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedRange, setSelectedRange] = useState<{ start: string; end: string } | null>(null);
  const [type, setType] = useState<"dayOff" | "break">("dayOff");
  const [reason, setReason] = useState("");

  const events = useMemo(
    () =>
      freeTimes.map((f) => ({
        id: f.id,
        title:
          f.type === "dayOff"
            ? t("doctorFreeDays.dayOff")
            : `${t("doctorFreeDays.break")}${f.reason ? `: ${f.reason}` : ""}`,
        start: f.start,
        end: f.end,
        backgroundColor: f.type === "dayOff" ? "#c62828" : "#ffb300",
        borderColor: f.type === "dayOff" ? "#b71c1c" : "#ffa000",
        textColor: "#fff",
      })),
    [freeTimes, t]
  );

  const handleSelect = (info: any) => {
    setSelectedRange({ start: info.startStr, end: info.endStr });
    setOpenModal(true);
  };

  const handleAddFreeTime = () => {
    if (!selectedRange) return;
    const newEvent: FreeTime = {
      id: String(Date.now()),
      start: selectedRange.start,
      end: selectedRange.end,
      type,
      reason,
    };
    console.log(newEvent.id);
    setFreeTimes([...freeTimes, newEvent]);
    setReason("");
    setOpenModal(false);
  };

  const handleEventClick = (info: any) => {
    if (window.confirm(t("doctorFreeDays.removeConfirm"))) {
      setFreeTimes((prev) => prev.filter((f) => f.id !== info.event.id));
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, minHeight: "100vh", backgroundColor: colors.color1 }}>
      <UserNavigation />

      <Box sx={{ flex: 1, p: 4, color: colors.white }}>
        <Typography variant="h4" gutterBottom sx={{ color: colors.color5 }}>
          {t("doctorFreeDays.title")}
        </Typography>

        <Typography variant="subtitle1" sx={{ mb: 3 }}>
          {t("doctorFreeDays.subtitle")}
        </Typography>

        {loading ? (
          <CircularProgress sx={{ color: colors.color5 }} />
        ) : (
          <Box sx={{ backgroundColor: colors.white, borderRadius: 3, p: 2 }}>
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="timeGridWeek"
              allDaySlot={true}
              selectable={true}
              select={handleSelect}
              eventClick={handleEventClick}
              events={events}
              height="auto"
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay",
              }}
            />
          </Box>
        )}

        {/* Modal do dodawania wolnego/przerwy */}
        <Modal open={openModal} onClose={() => setOpenModal(false)}>
          <Paper
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              p: 4,
              backgroundColor: colors.color2,
              color: colors.white,
              borderRadius: 3,
            }}
          >
            <Typography variant="h6" sx={{ color: colors.color5, mb: 2 }}>
              {t("doctorFreeDays.addTitle")}
            </Typography>

            <TextField
              select
              label={t("doctorFreeDays.type")}
              fullWidth
              value={type}
              onChange={(e) => setType(e.target.value as "dayOff" | "break")}
              sx={{ backgroundColor: colors.white, borderRadius: 1, mb: 2 }}
            >
              <MenuItem value="dayOff">{t("doctorFreeDays.dayOff")}</MenuItem>
              <MenuItem value="break">{t("doctorFreeDays.break")}</MenuItem>
            </TextField>

            {type === "break" && (
              <TextField
                label={t("doctorFreeDays.reason")}
                fullWidth
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                sx={{ backgroundColor: colors.white, borderRadius: 1, mb: 2 }}
              />
            )}

            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
              <Button
                variant="outlined"
                onClick={() => setOpenModal(false)}
                sx={{ borderColor: colors.color3, color: colors.white }}
              >
                {t("doctorFreeDays.cancel")}
              </Button>
              <Button
                variant="contained"
                onClick={handleAddFreeTime}
                sx={{ backgroundColor: colors.color3, color: colors.white }}
              >
                {t("doctorFreeDays.save")}
              </Button>
            </Box>
          </Paper>
        </Modal>
      </Box>
    </Box>
  );
}
