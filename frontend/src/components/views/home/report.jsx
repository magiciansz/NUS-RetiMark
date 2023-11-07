import React, { useState, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Modal from "./doc-notes";
import SaveModal from "./save-modal";
import { getAccessToken } from "../../auth/Auth";
import PatientApi from "../../../apis/PatientApi";

import "./report.css";

// Component: Report generated which consists of patient details, uploaded images, and risk probabilities
function Report({
  patient,
  leftEyeImage,
  rightEyeImage,
  onSave,
  newPatient,
  leftEyeResults,
  rightEyeResults,
}) {
  const reportRef = useRef(null);
  const [docNotes, setDocNotes] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [openSaveModal, setOpenSaveModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("Saving In Progress");

  const handleDownloadPDF = () => {
    if (reportRef.current) {
      html2canvas(reportRef.current).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "pt", [canvas.width, canvas.height]); 
        pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);

        // Save the PDF
        pdf.save("report.pdf");
      });
    }
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const closeModal = () => {
    setOpenModal(false);
  };

  const doctorNotes = (value) => {
    setDocNotes(value);
  };

  const closeSaveModal = () => {
    setOpenSaveModal(false);
    onSave();
  };

  const calculateAge = () => {
    const dob = new Date(patient.date_of_birth);
    const today = new Date();
    const age = today.getFullYear() - dob.getFullYear();
    return age;
  };

  const handleSave = async () => {
    setModalMessage("Saving In Progress");
    setOpenSaveModal(true);
    if (reportRef.current) {
      html2canvas(reportRef.current).then(async (canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "pt", [canvas.width, canvas.height]);
        pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);

        // Convert the PDF to a blob
        const pdfBlob = pdf.output("blob");

        // Now, send the PDF blob to the API
        const accessTokenData = await getAccessToken();
        if (accessTokenData) {
          const rightEyeBlob = await fetch(rightEyeImage).then((response) =>
            response.blob()
          );
          const leftEyeBlob = await fetch(leftEyeImage).then((response) =>
            response.blob()
          );

          const requestParams = {
            accessToken: accessTokenData,
            leftEye: leftEyeBlob,
            rightEye: rightEyeBlob,
            report: pdfBlob,
            patient,
            docNotes,
            leftEyeResults,
            rightEyeResults,
          };
          try {
            if (!newPatient) {
              // Include the 'id' field if its an existing patient
              requestParams.id = patient.id;
            }
            const res = newPatient
              ? await PatientApi.createPatient(requestParams)
              : await PatientApi.updatePatient(requestParams);
            console.log("Res from API", res);
            setModalMessage("Successfully saved!");
          } catch (err) {
            // Display different message in the modal based on the error code
            if (err.response.data.status === 401) {
              setModalMessage("Save failed. Authentication failed.");
            } else if (err.response.data.status === 409) {
              setModalMessage(
                "Save failed. A patient with the same name and DOB has been created before."
              );
            } else {
              setModalMessage(
                "Patient not found. Failed to update the patient's record."
              );
            }
            console.log(err.response.data.message);
            console.error(err);
          }
        }
      });
    }
  };

  return (
    <div>
      <div className="report-container" id="report-container">
        <div className="report" ref={reportRef}>
          <div className="report-header">REPORT</div>
          <div className="patient-details">
            <div className="sub-header">Patient details</div>
            Name: {patient.name}
            <br />
            Age: {newPatient ? patient.age : calculateAge()}
            <br />
            Sex: {newPatient ? patient.gender : patient.sex}
          </div>
          <div className="eye-image">
            <div className="sub-header">Eye Images</div>
            <div className="eye-images">
              <div className="indiv-eye">
                <img src={leftEyeImage} />
                <div className="img-caption">Left Eye</div>
              </div>
              <div className="indiv-eye">
                <img src={rightEyeImage} />
                <div className="img-caption">Right Eye</div>
              </div>
            </div>
          </div>
          <div className="results">
            <div className="sub-header">Results</div>
            <br />
            Probability of Diabetic Retinopathy: <br />
            Left: {(leftEyeResults.diabetic * 100).toFixed(1)}% | Right: {(rightEyeResults.diabetic * 100).toFixed(1)}%
            <br />
            <br />
            Probability of Age-related Macular Degeneration: <br />
            Left: {(leftEyeResults.amd * 100).toFixed(1)}% | Right: {(rightEyeResults.amd * 100).toFixed(1)}%
            <br />
            <br />
            Probability of Glaucoma: <br />
            Left: {(leftEyeResults.glaucoma * 100).toFixed(1)}% | Right: {(rightEyeResults.glaucoma * 100).toFixed(1)}%
          </div>
          {docNotes && (
            <div className="doc-notes">
              <div className="sub-header">Doctor's Notes</div>
              {docNotes}
            </div>
          )}
        </div>
      </div>
      <Modal
        isOpen={openModal}
        onClose={closeModal}
        doctorNotes={doctorNotes}
      />
      <div className="button-container">
        <div className="pdf-button">
          <div className="button" onClick={handleOpenModal}>
            Add Doctor's Note
          </div>
        </div>
        <div className="pdf-button">
          <div className="button" onClick={handleDownloadPDF}>
            Download PDF
          </div>
        </div>
      </div>
      <SaveModal
        isOpen={openSaveModal}
        onClose={closeSaveModal}
        modalMessage={modalMessage}
      />
      <div className="download-button">
        <div className="button" onClick={handleSave}>
          Save
        </div>
      </div>
    </div>
  );
}

export default Report;
