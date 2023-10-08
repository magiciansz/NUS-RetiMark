const { formatDateTime } = require("./DateUtil");
const moment = require("moment-timezone");

const convertPatientHistoryFormat = (histories, timezone) => {
  histories = histories.map((history) => history.toJSON());
  const patientHistory = {};
  histories.forEach((history) => {
    history.visit_date = formatDateTime(moment(history.visit_date), timezone);
    if (Object.prototype.hasOwnProperty.call(patientHistory, history.id)) {
      const currentDate = new Date(history.visit_date);
      const previousDate = new Date(
        patientHistory[history.id][
          patientHistory[history.id].length - 1
        ].visit_date
      );
      // compare patientHistory with the previous one. if it is the same date, we pop the latest one
      if (
        currentDate.toISOString().split("T")[0] !=
        previousDate.toISOString().split("T")[0]
      ) {
        patientHistory[history.id].push(history);
      }
    } else {
      patientHistory[history.id] = [history];
    }
  });
  return patientHistory;
};

module.exports = { convertPatientHistoryFormat };
