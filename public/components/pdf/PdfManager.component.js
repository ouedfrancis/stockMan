import React, { useState } from "react";
//import { Document, Page } from "react-pdf";
import {PDFViewer, Font, Page, Text, View, Document, StyleSheet,Image  } from '@react-pdf/renderer';
import ReactPDF from '@react-pdf/renderer';
import Utils from "../../utils/utils";
import globalObject from '../../global.js'
import Html from 'react-pdf-html';
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
  page: {width: '100%', padding: 20, height: "50vh" },
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
 fontSize: "14px",
},
titre: {
 fontSize: "20px",
 textAlign: 'center',
 fontWeight: 700
},
});
 const saveInFile=() =>{
return ReactPDF.render(<PDFDocument />, `${__dirname}/example.pdf`);

 }

const renderInDOM=() =>{
return (
  <PDFViewer style={{ position: 'relative', border: 0, height: '100%', width: '100%' }}>
    <PDFDocument />
  </PDFViewer>
  );

 }  

const PDFDocument=() =>{
  //console.log("Utils.createMarkup=======>>>>",Utils.createMarkup(props.content))
return (
     <Document>
    <Page style={styles.page} size="A4" wrap>
     <View style={[styles.box, { height: 120, backgroundColor: 'white' }]} >
     {(globalObject?.logo!=null&& <Image src={globalObject?.logo} style={{ margin:"10", height: '25px', width: '25px' }} />)}
    <Text style={styles.textSize12} > {globalObject.clinique.nomEntreprise}</Text>
    <Text style={styles.textSize12}>
        {globalObject.clinique.numRue} {globalObject.clinique.adresse} {globalObject.clinique.cp}
      </Text>
       <Text style={styles.textSize12}>
          {globalObject.clinique.ville!=null?globalObject.clinique.ville.nomVille:""}  {globalObject.clinique.ville!=null&& globalObject.clinique.ville.pays!=null ?globalObject.clinique?.ville?.pays.nomPays:""}
        </Text>
        <Text style={styles.textSize12}>
              Tél.: {globalObject.clinique.telAccueil}
        </Text>

      </View>
      <View style={[styles.box, { height: 40, backgroundColor: 'white' }]} >
      <Text style={styles.titre}> {props.titre}</Text>
      </View>
      <View style={[styles.box, { height: 600, backgroundColor: 'white' }]} >
         <Html style={styles.textSize12}>{Utils.createMarkup(props.content).__html}</Html>
       </View>
      <Text style={styles.pageNumbers} render={({ pageNumber, totalPages }) => (
        `${pageNumber} / ${totalPages}`
      )} fixed />
      
    </Page>
  </Document>
  );

 }  
console.log("pdf===========>",props)
  return (
    props.renderAs=="stream"?ReactPDF.renderToStream(<PDFDocument />):(props.renderAs=="save"?saveInFile():renderInDOM())
  );
}
