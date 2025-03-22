import React, { useState } from "react";
import { Document, Page,pdfjs } from 'react-pdf';



pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function AllPages(props) {
  const [numPages, setNumPages] = useState(null);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }



  const { pdf } = props;
  //const pdfVersion = "2.6.347"
//const pdfWorkerUrl = `http://localhost:8081/pdf/pdf.worker.js`
//const pdfWorkerUrl = `/pdf/pdf.worker.js`


  return (
    <Document
      file={pdf}
     // options={{ workerSrc: "/pdf/pdf.worker.js" }}
      onLoadSuccess={onDocumentLoadSuccess}
      width="150%"
    >
      {Array.from(new Array(numPages), (el, index) => (
        <Page key={`page_${index + 1}`} pageNumber={index + 1} />
      ))}
    </Document>
  );
}
