import React, { useState } from "react";
import { Snackbar, Alert as MuiAlert } from "@mui/material";

type AlertType = "success" | "error";

interface Alert {
  type: AlertType;
  message: string;
}

let setAlertGlobal: ((alert: Alert | null) => void) | null = null;

export function showAlert(alert: Alert) {
  if (setAlertGlobal) {
    setAlertGlobal(alert);
  } else {
    console.warn("GlobalAlertManager not initialized yet");
  }
}

export const GlobalAlert = () : React.ReactElement | null => {
  const [alert, setAlert] = useState<Alert | null>(null);

  setAlertGlobal = setAlert;

  const handleClose = () => setAlert(null);

  return (
    <Snackbar
      open={!!alert}
      autoHideDuration={4000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      {alert ? (
        <MuiAlert
          onClose={handleClose}
          severity={alert.type}
          elevation={6}
          sx={{
            fontSize:"1rem"
          }}
        >
          {alert.message}
        </MuiAlert>
      ) : undefined}
    </Snackbar>
  );
};
