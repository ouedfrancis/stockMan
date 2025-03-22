import React, {useState, useEffect } from "react";

import Utils from "../utils/utils";
import Styles from '../styles.module.css';

//import SinglePagePDFViewer from "./pdf/single-page";
import AllPagesPDFViewer from "./pdf/all-pages";
//import { sampleBase64pdf } from "./sampleBase64pdf";
/* This is required only if the project file is located 
inside the app. Otherwise you can use the external link of the pdf file*/
//import samplePDF from "/data/help/GlobalSantePlus_Aide.pdf";



 /* eslint-disable */
const Help = () => {

useEffect(() => {
 
  }, []);



return (
<div className="container">

        <header className="jumbotron">
               
        <div className="row" >
            <div className="col-md">  
                 <div className="container cf">
                   <div className={Styles.divBox}>
                    <h3 className={Styles.HeaderL1} > Aide</h3>
                                                  
                     <div className="col-md"> 
                          <table className='table table-bordered '>
                            <tbody>                                                 
                            <tr><th colSpan="2" className="table-active h6 text-right"><a  href="/data/help/GlobalSantePlus_Aide.pdf" target="_blank">
                              <img src="/img/pdf1.png" title="Télécharger l'aide"  alt="Télécharger l'aide" className="iconeButtonRectangle"/>Télécharger l'aide </a>
                            </th></tr>
                             <tr><td colSpan="2">
                             <div className="all-page-container">
                                  <AllPagesPDFViewer pdf="/data/help/GlobalSantePlus_Aide.pdf"/>
                                </div>                             
                             </td></tr> 
                           <tr><th colSpan="2" className="table-active h6">Annexe</th></tr>
                             <tr><td colSpan="2"> 
                          Liste des fichiers servant au chargement des données:
                            <ul>
                              <li>1-Pays : <a  href="/data/csv/pays.csv"> pays.csv </a></li>
                              <li>2-Villes: <a  href="/data/csv/villes.csv"> villes.csv </a>. Autre fichier (<a  href="/data/csv/villes_du_Burkina_Faso.csv"> villes_du_Burkina_Faso.csv </a>)</li>
                              <li>3-Catégories de Praticien: <a  href="/data/csv/categorie_de_praticiens.csv">categorie_de_praticiens.csv </a></li>
                              <li>4-Spécialités des Praticiens: <a  href="/data/csv/specialites_pratcien.csv">specialites_pratcien.csv </a></li>
                              <li>5-Types de prestations: <a  href="/data/csv/typePrestations.csv">typePrestations.csv </a></li>
                              <li>6-Type de consultation: <a  href="/data/csv/acteTypeConsultations.csv">acteTypeConsultations.csv </a></li>
                              <li>7-Type d'Actes: <a  href="/data/csv/acteTypeSoins.csv">acteTypeSoins.csv </a></li>
                              <li>8-Examens : <a  href="/data/csv/acteTypeExamens.csv"> acteTypeExamens.csv </a></li>
                              <li>9-Vaccins : <a  href="/data/csv/vaccins.csv"> vaccins.csv </a></li>
                              <li>10-Personnels : <a  href="/data/csv/personnels.csv"> personnels.csv </a></li>
                              <li>11-Patients : <a  href="/data/csv/patients.csv"> patients.csv </a></li>
                              <li>12-Médicaments : <a  href="/data/csv/medicaments.csv"> medicaments.csv </a></li>
                              <li>13-Liste des médicaments : <a  href="/data/csv/medicaments_liste.csv"> medicaments_liste.csv </a></li>
                            </ul>
                             </td></tr> 
 
                            
                           </tbody>
                          </table>
                        </div>
                   </div>
                    
                </div>
            </div>
        </div>           
        </header>
      </div>
  );
};

export default Help;