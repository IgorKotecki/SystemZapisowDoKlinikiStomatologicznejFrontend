import { colors } from "./colors";

export  const applayStatusColor = (status: string) => {
    switch (status) {
      case 'Cancelled':
        return 'gray';
      case "Anulowana":
        return 'gray';
      case 'Completed':
        return 'rgb(0, 128, 0)';
      case "Zakończona":
        return 'rgb(0, 128, 0)';
      default:
        return '';
    }
  };

export const applayStatusBgColor = (status: string) => {
    switch (status) {
      case 'Cancelled':
      case "Anulowana":
        return '#ffebee';
      case 'Completed':
      case "Zakończona":
        return '#c9fdc9';
      default:
        return '';
    }
  };

  export const applayStatusBorderColor = (status: string) => {
    switch (status) {
      case 'Cancelled':
      case "Anulowana":
        return '#f44336';
      case 'Completed':
      case "Zakończona":
        return 'rgb(73, 180, 73)';
      default:
        return colors.color3;
    }};

  export default {
    applayStatusColor,
    applayStatusBgColor,
    applayStatusBorderColor
  };