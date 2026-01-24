import { Box, DialogContent, Typography } from "@mui/material";
import type { Appointment } from "../Interfaces/Appointment";
import { colors } from "../utils/colors";
import { useTranslation } from "react-i18next";
import { applayStatusBgColor, applayStatusBorderColor } from "../utils/colorsUtils";

interface AppointmentDetailsDialogContentProps {
  selectedAppointmentDetail: Appointment | null;
}

export default function AppointmentDetailsDialogContent({ selectedAppointmentDetail }: AppointmentDetailsDialogContentProps) {
  const { t } = useTranslation();

  return (
    <DialogContent sx={{ p: 3 }}>
      <Box sx={{ display: 'grid', gap: 3 }}>
        {/* Wiersz 1: Pacjent, Doktor, Data */}
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
          {/* Pacjent */}
          <Box sx={{
            backgroundColor: colors.white,
            borderRadius: 2,
            p: 2,
            border: `1px solid ${colors.color3}20`,
            height: 'fit-content',
          }}>
            <Typography sx={{
              fontWeight: 600,
              mb: 1.5,
              color: colors.black,
              fontSize: '14px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              {t("receptionistCalendar.patient")}
            </Typography>
            <Box>
              <Typography sx={{ fontSize: '15px', fontWeight: 500, mb: 0.5, color: colors.black }}>
                {`${selectedAppointmentDetail?.user.name} ${selectedAppointmentDetail?.user.surname}`}
              </Typography>
              <Typography sx={{ fontSize: '14px', color: colors.black, opacity: 0.7, mb: 0.3 }}>
                {selectedAppointmentDetail?.user.email}
              </Typography>
              <Typography sx={{ fontSize: '14px', color: colors.black, opacity: 0.7 }}>
                {selectedAppointmentDetail?.user.phoneNumber}
              </Typography>
            </Box>
          </Box>

          {/* Doktor */}
          <Box sx={{
            backgroundColor: colors.white,
            borderRadius: 2,
            p: 2,
            border: `1px solid ${colors.color3}20`,
            height: 'fit-content',
          }}>
            <Typography sx={{
              fontWeight: 600,
              mb: 1.5,
              color: colors.black,
              fontSize: '14px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              {t("receptionistCalendar.doctor")}
            </Typography>
            <Box>
              <Typography sx={{ fontSize: '15px', fontWeight: 500, color: colors.black }}>
                {`${selectedAppointmentDetail?.doctor.name} ${selectedAppointmentDetail?.doctor.surname}`}
              </Typography>
            </Box>
          </Box>

          {/* Data i czas */}
          <Box sx={{
            backgroundColor: colors.white,
            borderRadius: 2,
            p: 2,
            border: `1px solid ${colors.color3}20`,
            height: 'fit-content',
          }}>
            <Typography sx={{
              fontWeight: 600,
              mb: 1.5,
              color: colors.black,
              fontSize: '14px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              {t("receptionistCalendar.date")} - {t("receptionistCalendar.time")}
            </Typography>
            <Box>
              <Typography sx={{ fontSize: '15px', fontWeight: 500, mb: 0.5, color: colors.black }}>
                {selectedAppointmentDetail?.startTime?.slice(0, 10)}
              </Typography>
              <Typography sx={{ fontSize: '14px', color: colors.black, opacity: 0.7 }}>
                {selectedAppointmentDetail?.startTime?.slice(11, 16)} - {selectedAppointmentDetail?.endTime?.slice(11, 16)}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Wiersz 2: Usługi i Status */}
        <Box sx={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 2 }}>
          {/* Usługi */}
          <Box sx={{
            backgroundColor: colors.white,
            borderRadius: 2,
            p: 2,
            border: `1px solid ${colors.color3}20`,
            height: 'fit-content',
          }}>
            <Typography sx={{
              fontWeight: 600,
              mb: 1.5,
              color: colors.black,
              fontSize: '14px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              {t("receptionistCalendar.services")}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              {selectedAppointmentDetail?.services.map((service, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    p: 1,
                    backgroundColor: colors.color3 + '10',
                    borderRadius: 1
                  }}
                >
                  <Typography sx={{ fontSize: '14px', color: colors.black }}>
                    {service.name}
                  </Typography>
                  <Typography sx={{ fontSize: '14px', fontWeight: 500, color: colors.black }}>
                    {service.lowPrice ?? service.highPrice ?? ''} PLN
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Status */}
          <Box sx={{
            backgroundColor: colors.white,
            borderRadius: 2,
            p: 2,
            border: `1px solid ${colors.color3}20`,
            height: 'fit-content',
          }}>
            <Typography sx={{
              fontWeight: 600,
              mb: 1.5,
              color: colors.black,
              fontSize: '14px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Status
            </Typography>
            <Box>
              <Box sx={{
                display: 'inline-block',
                px: 2,
                py: 1,
                borderRadius: 2,
                backgroundColor: applayStatusBgColor(selectedAppointmentDetail?.status || ""),
                color: colors.black,
                fontWeight: 500,
                fontSize: '14px',
                borderLeft: `3px solid ${applayStatusBorderColor(selectedAppointmentDetail?.status || "")}`
              }}>
                {selectedAppointmentDetail?.status}
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Wiersz 3: Note i Cancellation Reason */}
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          {/* Note */}
          <Box sx={{
            backgroundColor: colors.white,
            borderRadius: 2,
            p: 2,
            border: `1px solid ${colors.color3}20`,
            height: 'fit-content',
          }}>
            <Typography sx={{
              fontWeight: 600,
              mb: 1.5,
              color: colors.black,
              fontSize: '14px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              {t("userAppointments.note")}
            </Typography>
            <Box sx={{
              p: 1.5,
              backgroundColor: colors.color3 + '10',
              borderRadius: 1,
              borderLeft: `3px solid ${colors.color3}`
            }}>
              <Typography sx={{
                fontSize: '14px',
                color: colors.black,
                lineHeight: 1.6,
                fontStyle: !selectedAppointmentDetail?.notes ? 'italic' : 'normal',
                opacity: !selectedAppointmentDetail?.notes ? 0.5 : 1
              }}>
                {selectedAppointmentDetail?.notes || t("userAppointments.noNotes")}
              </Typography>
            </Box>
          </Box>

          {/* Cancellation Reason */}
          <Box sx={{
            backgroundColor: colors.white,
            borderRadius: 2,
            p: 2,
            border: `1px solid ${colors.color3}20`,
            height: 'fit-content',
          }}>
            <Typography sx={{
              fontWeight: 600,
              mb: 1.5,
              color: colors.black,
              fontSize: '14px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              {t("userAppointments.cancellationReason")}
            </Typography>
            <Box sx={{
              p: 1.5,
              backgroundColor: selectedAppointmentDetail?.cancellationReason ? '#ffebee' : colors.color3 + '10',
              borderRadius: 1,
              borderLeft: selectedAppointmentDetail?.cancellationReason ? `3px solid #f44336` : `3px solid ${colors.color3}`
            }}>
              <Typography sx={{
                fontSize: '14px',
                color: colors.black,
                lineHeight: 1.6,
                fontStyle: !selectedAppointmentDetail?.cancellationReason ? 'italic' : 'normal',
                opacity: !selectedAppointmentDetail?.cancellationReason ? 0.5 : 1
              }}>
                {selectedAppointmentDetail?.cancellationReason || t("userAppointments.noCancellationReason")}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Wiersz 4: Additional Information */}
        <Box sx={{
          backgroundColor: colors.white,
          borderRadius: 2,
          p: 2,
          border: `1px solid ${colors.color3}20`,
          height: 'fit-content',
        }}>
          <Typography sx={{
            fontWeight: 600,
            mb: 1.5,
            color: colors.black,
            fontSize: '14px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            {t("userAppointments.additionalInfo")}
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            {selectedAppointmentDetail?.additionalInformation && selectedAppointmentDetail.additionalInformation.length > 0 ? (
              selectedAppointmentDetail.additionalInformation.map((info, index) => (
                <Box
                  key={index}
                  sx={{
                    p: 1.5,
                    backgroundColor: colors.color3 + '10',
                    borderRadius: 1,
                    borderLeft: `3px solid ${colors.color3}`
                  }}
                >
                  <Typography sx={{
                    fontSize: '14px',
                    color: colors.black,
                    lineHeight: 1.6
                  }}>
                    {info.body}
                  </Typography>
                </Box>
              ))
            ) : (
              <Box sx={{
                p: 1.5,
                backgroundColor: colors.color3 + '10',
                borderRadius: 1,
                borderLeft: `3px solid ${colors.color3}`
              }}>
                <Typography sx={{
                  fontSize: '14px',
                  color: colors.black,
                  lineHeight: 1.6,
                  fontStyle: 'italic',
                  opacity: 0.5
                }}>
                  {t("userAppointments.noAdditionalInfo")}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </DialogContent>
  );
}