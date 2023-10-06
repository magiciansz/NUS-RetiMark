const getCurrentDateWithoutSpaces = () => {
  const currentDate = new Date();

  const year = currentDate.getUTCFullYear();
  const month = String(currentDate.getUTCMonth() + 1).padStart(2, "0"); // Month is zero-based
  const day = String(currentDate.getUTCDate()).padStart(2, "0");
  const hours = String(currentDate.getUTCHours()).padStart(2, "0");
  const minutes = String(currentDate.getUTCMinutes()).padStart(2, "0");
  const seconds = String(currentDate.getUTCSeconds()).padStart(2, "0");
  const dateTimeString = `${year}${month}${day}${hours}${minutes}${seconds}`;

  return dateTimeString;
};

const formatDateTime = (datetime, timezone) => {
  return datetime.tz(timezone).format("YYYY-MM-DDTHH:mm:ssZ");
};

module.exports = {
  getCurrentDateWithoutSpaces,
  formatDateTime,
};
