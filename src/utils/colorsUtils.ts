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

  export default applayStatusColor;