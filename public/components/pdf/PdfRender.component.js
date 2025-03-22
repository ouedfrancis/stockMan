import React, { useState } from "react";
//import { Document, Page } from "react-pdf";
import {PDFViewer, PDFDownloadLink, Font, Page, Text, View, Document, StyleSheet,Image  } from '@react-pdf/renderer';
import ReactPDF from '@react-pdf/renderer';
import Utils from "../../utils/utils";
import globalObject from '../../global.js'
import Html from 'react-pdf-html';
import { Button } from 'react-bootstrap';
export const onRenderDocument = ({blob}, fileName) => {

  console.log("fileName====>",fileName)
  var blobUrl = URL.createObjectURL(blob);
  saveDocument(blobUrl, fileName);
};

export const saveDocument = (function () {
  var a = document.createElement("a");
  document.body.appendChild(a);
  a.style = "display: none";
  return function (blob, fileName) {
    a.href = blob;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(blob);
  };
}());
export default function PdfManager(props) {

// Create styles
// Register font
Font.register({
 
  fonts: [
    
    {
      fontWeight: 'bold',
      fontStyle: 'italic'
    }
  ]
})
Font.register({
   family: 'Poppins',
  fonts: [
    
    {
      fontWeight: 'bold',
      fontStyle: 'italic'
    }
  ]
})
const styles = StyleSheet.create({
  page: {width: '100%', padding: 20, height: "150vh" },
  box: { width: '100%', marginBottom: 10, borderRadius: 5 },
  pageNumbers: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize:'10px'

  }, 
section: {
  margin: 10,
  padding: 10,    
},
textSize12: {
 fontSize: "12px",
},

titre: {
 fontSize: "20px",
 textAlign: 'center',
 fontWeight: 700
},
});

const PdfViewer=() =>{
return (
  <PDFViewer style={{ position: 'relative', border: 0, minHeight: '600px',height: '100%', width: '100%' }}>
   {props?.save!=null&&props?.save==true? <PDFDocumentWithSave />:<PDFDocument />}
  </PDFViewer>
  );

 }  

const PdfDownload = () => (
  <div >
    <PDFDownloadLink
      className=" bg-slate-600"
      document= {props?.save!=null&&props?.save==true? <PDFDocumentWithSave />:<PDFDocument />}
      fileName={props.fileName}
    > 
       {({ blob, url, loading, error }) => (loading ? 
        <Button variant="secondary" className="text-center"> Chargement en cours...</Button>
         : <Button variant="success" className="text-center">Télécharger maintenant!</Button>)}
      
    </PDFDownloadLink></div>
);

const PDFDocumentWithSave=() =>{
return (
   <Document onRender={ (blob) => onRenderDocument(blob, props.fileName)} title={props.fileName} subject={props.fileName} 
     author={globalObject?.clinique?.nomEntreprise} keywords={props?.keywords} creator={globalObject?.clinique?.nomEntreprise}
     producer={globalObject?.clinique?.nomEntreprise}>
    <PDFPage/>
  </Document>
  );
 }  


const PDFDocument=() =>{
return (
   <Document>
    <PDFPage/>
  </Document>
  );
 }  

const PDFPage1=() =>{
return (   
    <Page style={styles.page} size={`${props?.format!=null &&props?.format!='' ? props?.format : 'A5'}`}  wrap>   
         <Html>
         {props.html}
        </Html>       
      <Text style={styles.pageNumbers} render={({ pageNumber, totalPages }) => (
        `${pageNumber} / ${totalPages}`
      )} fixed />     
    </Page>
  );

 } 

const PDFPage = () => {
  const headerHeight = 70; // Hauteur de l'en-tête en points
  const footerHeight = 70; // Hauteur du pied de page en points
  const padding = 20; // Marges internes de la page
  return (

        <Page  size={getPageSize(props?.format,props?.orientation)} style={styles.page} wrap>
           {props?.htmlTemplate?.header!=null&&
           <View   
          /*style={{
            //height: headerHeight,
            marginBottom: 5,
           }}*/
           >
              <Html>
                {props?.htmlTemplate?.header}
              </Html> 
           </View>
            }
          {props?.htmlTemplate?.body!=null&&
          <View style={styles.textSize12} wrap>
            <Html>           
                {props?.htmlTemplate?.body}
              </Html>
          </View>}

          {(props?.footerFixed!=null&&props?.footerFixed==true)?(
           <View fixed style={styles.pageNumbers}>
             <Html>           
                {props?.htmlTemplate?.footer}
              </Html>
              <Text render={({ pageNumber, totalPages }) => (
                  `${pageNumber} / ${totalPages}`
                )}  />
          </View>):(
         
           <View fixed style={styles.pageNumbers} 
           /*style={{
            height: footerHeight,
            marginTop: 10,
            borderTop: "0.5px solid #ccc",
            paddingTop: 10,
            position: 'absolute',
            bottom: 20,
            left: 0,
            right: 0,
            textAlign: 'center',
            fontSize:'10px'
          }}*/
          >
               <Text render={({ pageNumber, totalPages }) => (
                  `${pageNumber} / ${totalPages}`
                )}  /> 
           </View>)}
          
        </Page>
  );
};

// Définir la taille de la page en fonction du format et de l'orientation
  const getPageSize = (format,orientation) => {
    if (format === 'A4') {
      return orientation === 'portrait' ? 'A4' : [842, 595]; // A4 portrait vs paysage
    } else if (format === 'A5') {
      return orientation === 'portrait' ? 'A5' : [595, 420]; // A5 portrait vs paysage
    }
    return 'A4'; // Valeur par défaut
  };

  return (
    props?.renderAs=="PdfViewer"?PdfViewer():(PdfDownload())
  );
}
