const { formatDateTime } = require("./DateUtil");
const moment = require("moment-timezone");

const convertPatientHistoryFormat = (histories, timezone) => {
  histories = histories.map((history) => history.toJSON());
  const patientHistory = {};
  histories.forEach((history) => {
    history.visit_date = formatDateTime(moment(history.visit_date), timezone);
    if (Object.prototype.hasOwnProperty.call(patientHistory, history.id)) {
      patientHistory[history.id].push(history);
    } else {
      patientHistory[history.id] = [history];
    }
  });
  return patientHistory;
};

module.exports = { convertPatientHistoryFormat };
