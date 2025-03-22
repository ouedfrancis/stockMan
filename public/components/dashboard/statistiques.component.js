import React, {useState, useEffect } from "react";
import Utils from "../../utils/utils";
import Styles from '../../styles.module.css';
import StatistiquesDataService from "../../services/statistiques.service";
/********Date management******
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@mui/pickers';*/
import 'date-fns';
import { TextField } from '@mui/material';


import globalObject from '../../global.js'
/**********autocomplete**********/
import Autocomplete from '@mui/lab/Autocomplete';

 /* eslint-disable */
const Statistiques = () => {


const [statistique, setStatistique] = useState(undefined);
const [statistiques, setStatistiques] = useState([]);

const        permissionPatient=Utils.trouverObjetDansListObject(globalObject?.permissions,"ressource","STATISTIQUE/FICHE_PATIENT");
const        permissionConsultation=Utils.trouverObjetDansListObject(globalObject?.permissions,"ressource","STATISTIQUE/CONSULTATION");
const        permissionSoin=Utils.trouverObjetDansListObject(globalObject?.permissions,"ressource","STATISTIQUE/SOIN");
const        permissionRdv=Utils.trouverObjetDansListObject(globalObject?.permissions,"ressource","STATISTIQUE/RDV");
const        permissionHospitalisation=Utils.trouverObjetDansListObject(globalObject?.permissions,"ressource","STATISTIQUE/HOSPITALISATION");
const        permissionLit=Utils.trouverObjetDansListObject(globalObject?.permissions,"ressource","STATISTIQUE/LIT");
const        permissionExamen=Utils.trouverObjetDansListObject(globalObject?.permissions,"ressource","STATISTIQUE/ANALYSE_MEDICALE");
const        permissionExamenResultat=Utils.trouverObjetDansListObject(globalObject?.permissions,"ressource","STATISTIQUE/RESULTAT_ANALYSE_MEDICALE");
const        permissionFacture=Utils.trouverObjetDansListObject(globalObject?.permissions,"ressource","STATISTIQUE/FACTURE");
const        permissionHReglementFacture=Utils.trouverObjetDansListObject(globalObject?.permissions,"ressource","STATISTIQUE/REGLEMENT_FACTURE");
const        permissionEntrepot=Utils.trouverObjetDansListObject(globalObject?.permissions,"ressource","STATISTIQUE/ENTREPOT");
const        permissionCompteDeDepot=Utils.trouverObjetDansListObject(globalObject?.permissions,"ressource","STATISTIQUE/COMPTE_DE_DEPOT");

useEffect(() => {
 

     
  retrieveStatistiques()
  }, []);



async function retrieveStatistiques (){
    let resp=null;
    
    resp= await StatistiquesDataService.getAllAsync();  
    if(resp!=null && resp.status=="200" )          
      {
    
        //setUsers(resp.data);
        console.log("setStatistiques=======>", resp.data);
       await  setStatistiques(await resp.data);       
      }else {
        await  setStatistiques([]);
         console.log("stat vide");
      }
       
}





return (
    <div className="container">  
        {(statistiques!=null && statistiques.length>0) && (
          <div>
          {(permissionPatient!=null)&&(
            <div className="row">
            <div className="col-md">  
                     <div className="container cf">
                       <div className={Styles.divBox}>
                       <div className="row">
                           
                       <div className="col-md text-left h1" style={{ color: `var(--horizontal-menu-background-color)` }} > 
                            {(Utils.filterArrayByFieldNameAndValueAndOneObject(statistiques,"key","countPatient").value)} 
                        </div>
                        <div className="col-md text-right"> <img src="/img/patient.png" alt="profile-img" className="icone50"/></div>
                       </div>
                       <div className="row">
                         <span className="h6" >{(Utils.filterArrayByFieldNameAndValueAndOneObject(statistiques,"key","countPatient")?.label)}</span>
                       </div>
                       </div>
                    </div>
                </div>
                 <div className="col-md">  
                     <div className="container cf">
                       <div className={Styles.divBox}>
                       <div className="row">
                           
                       <div className="col-md text-left h1" style={{ color: `var(--horizontal-menu-background-color)` }} > 
                        {(Utils.filterArrayByFieldNameAndValueAndOneObject(statistiques,"key","countNewPatient")?.value)}
                       </div>
                        <div className="col-md text-right"> <img src="/img/newPatient.png" alt="profile-img" className="icone50"/></div>
                       </div>
                       <div className="row">
                          <span className="h6" >{(Utils.filterArrayByFieldNameAndValueAndOneObject(statistiques,"key","countNewPatient")?.label)}</span>
                       </div>
                       </div>
                    </div>
                </div>                

             <div className="col-md">  
                     <div className="container cf">
                       <div className={Styles.divBox}>
                       <div className="row">
                           
                       <div className="col-md text-left h1" style={{ color: `var(--horizontal-menu-background-color)` }} > 
                        {(Utils.filterArrayByFieldNameAndValueAndOneObject(statistiques,"key","countProfessionnelDeSante")?.value)}
                       </div>
                        <div className="col-md text-right"> <img src="/img/docteur.png" alt="profile-img" className="icone50"/></div>
                       </div>
                       <div className="row">
                          <span className="h6" > {(Utils.filterArrayByFieldNameAndValueAndOneObject(statistiques,"key","countProfessionnelDeSante")?.label)}</span>
                       </div>
                       </div>
                    </div>
                </div>
                
            </div>)}






{(permissionRdv!=null)&&(
             <div className="row">
             <div className="col-md">  
                     <div className="container cf">
                       <div className={Styles.divBox}>
                       <div className="row">
                           
                       <div className="col-md text-left h1" style={{ color: `var(--horizontal-menu-background-color)` }} > 
                        {(Utils.filterArrayByFieldNameAndValueAndOneObject(statistiques,"key","countRdv")?.value)}
                       </div>
                        <div className="col-md text-right"> <img src="/img/rdv.png" alt="profile-img" className="icone50"/></div>
                       </div>
                       <div className="row">
                          <span className="h6" > {(Utils.filterArrayByFieldNameAndValueAndOneObject(statistiques,"key","countRdv")?.label)}</span>
                       </div>
                       </div>
                    </div>
                </div>
                <div className="col-md">  
                     <div className="container cf">
                       <div className={Styles.divBox}>
                       <div className="row">
                           
                       <div className="col-md text-left h1" style={{ color: `var(--horizontal-menu-background-color)` }} > 
                            {(Utils.filterArrayByFieldNameAndValueAndOneObject(statistiques,"key","countNewRdv")?.value)} 
                        </div>
                        <div className="col-md text-right"> <img src="/img/newRdv.png" alt="profile-img" className="icone50"/></div>
                       </div>
                       <div className="row">
                         <span className="h6" > {(Utils.filterArrayByFieldNameAndValueAndOneObject(statistiques,"key","countNewRdv")?.label)}</span>
                       </div>
                       </div>
                    </div>
                </div>
                 <div className="col-md">  
                     <div className="container cf">
                       <div className={Styles.divBox}>
                       <div className="row">
                           
                       <div className="col-md text-left h1" style={{ color: `var(--horizontal-menu-background-color)` }} > 
                        {(Utils.filterArrayByFieldNameAndValueAndOneObject(statistiques,"key","countTodayRdv")?.value)}
                       </div>
                        <div className="col-md text-right"> <img src="/img/rdvAvecPraticien.png" alt="profile-img" className="icone50"/></div>
                       </div>
                       <div className="row">
                          <span className="h6" >{(Utils.filterArrayByFieldNameAndValueAndOneObject(statistiques,"key","countTodayRdv")?.label)}</span>
                       </div>
                       </div>
                    </div>
                </div>                

            </div>
  )}

{(permissionConsultation!=null)&&(
           <div className="row">
             <div className="col-md">  
                     <div className="container cf">
                       <div className={Styles.divBox}>
                       <div className="row">
                           
                       <div className="col-md text-left h1" style={{ color: `var(--horizontal-menu-background-color)` }} > 
                        {(Utils.filterArrayByFieldNameAndValueAndOneObject(statistiques,"key","countConsultation").value)}
                       </div>
                        <div className="col-md text-right"> <img src="/img/addConsultation3.png" alt="profile-img" className="icone50"/></div>
                       </div>
                       <div className="row">
                          <span className="h6" >  {(Utils.filterArrayByFieldNameAndValueAndOneObject(statistiques,"key","countConsultation")?.label)}</span>
                       </div>
                       </div>
                    </div>
                </div>
                <div className="col-md">  
                     <div className="container cf">
                       <div className={Styles.divBox}>
                       <div className="row">
                           
                       <div className="col-md text-left h1" style={{ color: `var(--horizontal-menu-background-color)` }} > 
                            {(Utils.filterArrayByFieldNameAndValueAndOneObject(statistiques,"key","countNewConsultation")?.value)} 
                        </div>
                        <div className="col-md text-right"> <img src="/img/addConsultation.png" alt="profile-img" className="icone50"/></div>
                       </div>
                       <div className="row">
                         <span className="h6" >   {(Utils.filterArrayByFieldNameAndValueAndOneObject(statistiques,"key","countNewConsultation")?.label)}</span>
                       </div>
                       </div>
                    </div>
                </div>
                 <div className="col-md">  
                     <div className="container cf">
                       <div className={Styles.divBox}>
                       <div className="row">
                           
                       <div className="col-md text-left h1" style={{ color: `var(--horizontal-menu-background-color)` }} > 
                        {(Utils.filterArrayByFieldNameAndValueAndOneObject(statistiques,"key","countConsultationByStatut")?.value)}
                       </div>
                        <div className="col-md text-right"> <img src="/img/addConsultation.png" alt="profile-img" className="icone50"/></div>
                       </div>
                       <div className="row">
                          <span className="h6" > {(Utils.filterArrayByFieldNameAndValueAndOneObject(statistiques,"key","countConsultationByStatut")?.label)}</span>
                       </div>
                       </div>
                    </div>
                </div>                

            </div>)}










{(permissionSoin!=null)&&(

             <div className="row">
             <div className="col-md">  
                     <div className="container cf">
                       <div className={Styles.divBox}>
                       <div className="row">
                           
                       <div className="col-md text-left h1" style={{ color: `var(--horizontal-menu-background-color)` }} > 
                        {(Utils.filterArrayByFieldNameAndValueAndOneObject(statistiques,"key","countSoins")?.value)}
                       </div>
                        <div className="col-md text-right"> <img src="/img/addSoin0.png" alt="profile-img" className="icone50"/></div>
                       </div>
                       <div className="row">
                          <span className="h6" >  {(Utils.filterArrayByFieldNameAndValueAndOneObject(statistiques,"key","countSoins")?.label)} </span>
                       </div>
                       </div>
                    </div>
                </div>
                <div className="col-md">  
                     <div className="container cf">
                       <div className={Styles.divBox}>
                       <div className="row">
                           
                       <div className="col-md text-left h1" style={{ color: `var(--horizontal-menu-background-color)` }} > 
                            {(Utils.filterArrayByFieldNameAndValueAndOneObject(statistiques,"key","countNewSoins")?.value)} 
                        </div>
                        <div className="col-md text-right"> <img src="/img/addSoin.png" alt="profile-img" className="icone50"/></div>
                       </div>
                       <div className="row">
                         <span className="h6" >{(Utils.filterArrayByFieldNameAndValueAndOneObject(statistiques,"key","countNewSoins")?.label)} </span>
                       </div>
                       </div>
                    </div>
                </div>
                 <div className="col-md">  
                     <div className="container cf">
                       <div className={Styles.divBox}>
                       <div className="row">
                           
                       <div className="col-md text-left h1" style={{ color: `var(--horizontal-menu-background-color)` }} > 
                        {(Utils.filterArrayByFieldNameAndValueAndOneObject(statistiques,"key","countPrescription")?.value)}
                       </div>
                        <div className="col-md text-right"> <img src="/img/addMedicament.png" alt="profile-img" className="icone50"/></div>
                       </div>
                       <div className="row">
                          <span className="h6" > {(Utils.filterArrayByFieldNameAndValueAndOneObject(statistiques,"key","countPrescription")?.label)}</span>
                       </div>
                       </div>
                    </div>
                </div>                

            </div>)}


{(permissionExamen!=null)&&(
           <div className="row">
             <div className="col-md">  
                     <div className="container cf">
                       <div className={Styles.divBox}>
                       <div className="row">
                           
                       <div className="col-md text-left h1" style={{ color: `var(--horizontal-menu-background-color)` }} > 
                        {(Utils.filterArrayByFieldNameAndValueAndOneObject(statistiques,"key","countExamens").value)}
                       </div>
                        <div className="col-md text-right"> <img src="/img/microscope.png" alt="profile-img" className="icone50"/></div>
                       </div>
                       <div className="row">
                          <span className="h6" >  {(Utils.filterArrayByFieldNameAndValueAndOneObject(statistiques,"key","countExamens").label)}</span>
                       </div>
                       </div>
                    </div>
                </div>
                <div className="col-md">  
                     <div className="container cf">
                       <div className={Styles.divBox}>
                       <div className="row">
                           
                       <div className="col-md text-left h1" style={{ color: `var(--horizontal-menu-background-color)` }} > 
                            {(Utils.filterArrayByFieldNameAndValueAndOneObject(statistiques,"key","countExamenToDo")?.value)} 
                        </div>
                        <div className="col-md text-right"> <img src="/img/microscope.png" alt="profile-img" className="icone50"/></div>
                       </div>
                       <div className="row">
                         <span className="h6" >   {(Utils.filterArrayByFieldNameAndValueAndOneObject(statistiques,"key","countExamenToDo")?.label)}</span>
                       </div>
                       </div>
                    </div>
                </div>
                 <div className="col-md">  
                     <div className="container cf">
                       <div className={Styles.divBox}>
                       <div className="row">
                           
                       <div className="col-md text-left h1" style={{ color: `var(--horizontal-menu-background-color)` }} > 
                        {(Utils.filterArrayByFieldNameAndValueAndOneObject(statistiques,"key","countExamensDone")?.value)}
                       </div>
                        <div className="col-md text-right"> <img src="/img/microscope.png" alt="profile-img" className="icone50"/></div>
                       </div>
                       <div className="row">
                          <span className="h6" >  {(Utils.filterArrayByFieldNameAndValueAndOneObject(statistiques,"key","countExamensDone")?.label)}</span>
                       </div>
                       </div>
                    </div>
                </div>                

            </div>)}


{(permissionExamenResultat!=null)&&(
           <div className="row">
             <div className="col-md">  
                     <div className="container cf">
                       <div className={Styles.divBox}>
                       <div className="row">
                           
                       <div className="col-md text-left h1" style={{ color: `var(--horizontal-menu-background-color)` }} > 
                        {(Utils.filterArrayByFieldNameAndValueAndOneObject(statistiques,"key","countNewExamens").value)}
                       </div>
                        <div className="col-md text-right"> <img src="/img/microscope.png" alt="profile-img" className="icone50"/></div>
                       </div>
                       <div className="row">
                          <span className="h6" >  {(Utils.filterArrayByFieldNameAndValueAndOneObject(statistiques,"key","countNewExamens").label)}</span>
                       </div>
                       </div>
                    </div>
                </div>
                <div className="col-md">  
                     <div className="container cf">
                       <div className={Styles.divBox}>
                       <div className="row">
                           
                       <div className="col-md text-left h1" style={{ color: `var(--horizontal-menu-background-color)` }} > 
                            {(Utils.filterArrayByFieldNameAndValueAndOneObject(statistiques,"key","countNewExamensToDo")?.value)} 
                        </div>
                        <div className="col-md text-right"> <img src="/img/microscope.png" alt="profile-img" className="icone50"/></div>
                       </div>
                       <div className="row">
                         <span className="h6" >   {(Utils.filterArrayByFieldNameAndValueAndOneObject(statistiques,"key","countNewExamensToDo")?.label)}</span>
                       </div>
                       </div>
                    </div>
                </div>
                 <div className="col-md">  
                     <div className="container cf">
                       <div className={Styles.divBox}>
                       <div className="row">
                           
                       <div className="col-md text-left h1" style={{ color: `var(--horizontal-menu-background-color)` }} > 
                        {(Utils.filterArrayByFieldNameAndValueAndOneObject(statistiques,"key","countNewExamensDone")?.value)}
                       </div>
                        <div className="col-md text-right"> <img src="/img/microscope.png" alt="profile-img" className="icone50"/></div>
                       </div>
                       <div className="row">
                          <span className="h6" >  {(Utils.filterArrayByFieldNameAndValueAndOneObject(statistiques,"key","countNewExamensDone")?.label)}</span>
                       </div>
                       </div>
                    </div>
                </div>                

            </div>)}

{(permissionHospitalisation!=null)&&(
           <div className="row">
             <div className="col-md">  
                     <div className="container cf">
                       <div className={Styles.divBox}>
                       <div className="row">
                           
                       <div className="col-md text-left h1" style={{ color: `var(--horizontal-menu-background-color)` }} > 
                        {(Utils.filterArrayByFieldNameAndValueAndOneObject(statistiques,"key","countHospitalisation").value)}
                       </div>
                        <div className="col-md text-right"> <img src="/img/hospitalisation.png" alt="profile-img" className="icone50"/></div>
                       </div>
                       <div className="row">
                          <span className="h6" >  {(Utils.filterArrayByFieldNameAndValueAndOneObject(statistiques,"key","countHospitalisation").label)}</span>
                       </div>
                       </div>
                    </div>
                </div>
                <div className="col-md">  
                     <div className="container cf">
                       <div className={Styles.divBox}>
                       <div className="row">
                           
                       <div className="col-md text-left h1" style={{ color: `var(--horizontal-menu-background-color)` }} > 
                            {(Utils.filterArrayByFieldNameAndValueAndOneObject(statistiques,"key","countNewHospitalisation")?.value)} 
                        </div>
                        <div className="col-md text-right"> <img src="/img/hospitalisationAdd.png" alt="profile-img" className="icone50"/></div>
                       </div>
                       <div className="row">
                         <span className="h6" >   {(Utils.filterArrayByFieldNameAndValueAndOneObject(statistiques,"key","countNewHospitalisation")?.label)}</span>
                       </div>
                       </div>
                    </div>
                </div>
                 <div className="col-md">  
                     <div className="container cf">
                       <div className={Styles.divBox}>
                       <div className="row">
                           
                       <div className="col-md text-left h1" style={{ color: `var(--horizontal-menu-background-color)` }} > 
                        {(Utils.filterArrayByFieldNameAndValueAndOneObject(statistiques,"key","countHospitalisationByStatut")?.value)}
                       </div>
                        <div className="col-md text-right"> <img src="/img/hospitalisationAdd.png" alt="profile-img" className="icone50"/></div>
                       </div>
                       <div className="row">
                          <span >{(Utils.filterArrayByFieldNameAndValueAndOneObject(statistiques,"key","countHospitalisationByStatut")?.label)}</span>
                       </div>
                       </div>
                    </div>
                </div>                

            </div>)}



{(permissionLit!=null)&&(
  <div className="row">
             <div className="col-md">  
                     <div className="container cf">
                       <div className={Styles.divBox}>
                       <div className="row">
                           
                       <div className="col-md text-left h1" style={{ color: `var(--horizontal-menu-background-color)` }} > 
                        {(Utils.filterArrayByFieldNameAndValueAndOneObject(statistiques,"key","countLit").value)}
                       </div>
                        <div className="col-md text-right"> <img src="/img/hospital-bed1.png" alt="profile-img" className="icone50"/></div>
                       </div>
                       <div className="row">
                          <span className="h6" >  {(Utils.filterArrayByFieldNameAndValueAndOneObject(statistiques,"key","countLit").label)}</span>
                       </div>
                       </div>
                    </div>
                </div>
                <div className="col-md">  
                     <div className="container cf">
                       <div className={Styles.divBox}>
                       <div className="row">
                           
                       <div className="col-md text-left h1" style={{ color: `var(--horizontal-menu-background-color)` }} > 
                            {(Utils.filterArrayByFieldNameAndValueAndOneObject(statistiques,"key","countLitByStatutAndLibre")?.value)} 
                        </div>
                        <div className="col-md text-right"> <img src="/img/hospital-bed1.png" alt="profile-img" className="icone50"/></div>
                       </div>
                       <div className="row">
                         <span className="h6" > {(Utils.filterArrayByFieldNameAndValueAndOneObject(statistiques,"key","countLitByStatutAndLibre")?.label)} </span>
                       </div>
                       </div>
                    </div>
                </div>
                 <div className="col-md">  
                     <div className="container cf">
                       <div className={Styles.divBox}>
                       <div className="row">
                           
                       <div className="col-md text-left h1" style={{ color: `var(--horizontal-menu-background-color)` }} > 
                        {(Utils.filterArrayByFieldNameAndValueAndOneObject(statistiques,"key","countLitByStatutAndOccupe")?.value)}  
                       </div>
                        <div className="col-md text-right"> <img src="/img/hospital-bed.png" alt="profile-img" className="icone50"/></div>
                       </div>
                       <div className="row">
                          <span className="h6" >{(Utils.filterArrayByFieldNameAndValueAndOneObject(statistiques,"key","countLitByStatutAndOccupe")?.label)}... soit {(Utils.filterArrayByFieldNameAndValueAndOneObject(statistiques,"key","tauxLitOccupe")?.value)}%</span>
                       </div>
                       </div>
                    </div>
                </div>                

            </div>
)}

{(permissionFacture!=null)&&(
  <div className="row">
             <div className="col-md">  
                     <div className="container cf">
                       <div className={Styles.divBox}>
                       <div className="row">
                           
                       <div className="col-md-9 text-left h3" style={{ color: `var(--horizontal-menu-background-color)` }} > 
                        {(Utils.filterArrayByFieldNameAndValueAndOneObject(statistiques,"key","sumMontantFactureToday").value)} {globalObject?.clinique?.config?.deviseMonetaire} 
                       </div>
                        <div className="col-md-3 text-right"> <img src="/img/facture.png" alt="profile-img" className="icone50"/></div>
                       </div>
                       <div className="row">
                          <span className="h6" >  {(Utils.filterArrayByFieldNameAndValueAndOneObject(statistiques,"key","sumMontantFactureToday").label)}</span>
                          <span className="h6" >  {(Utils.filterArrayByFieldNameAndValueAndOneObject(statistiques,"key","sumMontantAChargePatientToday").label)}: {(Utils.filterArrayByFieldNameAndValueAndOneObject(statistiques,"key","sumMontantAChargePatientToday").value)} {globalObject?.clinique?.config?.deviseMonetaire} </span>
                          <span className="h6" >  {(Utils.filterArrayByFieldNameAndValueAndOneObject(statistiques,"key","sumMontantAChargeAssureurToday").label)}:{(Utils.filterArrayByFieldNameAndValueAndOneObject(statistiques,"key","sumMontantAChargeAssureurToday").value)} {globalObject?.clinique?.config?.deviseMonetaire} </span>

                       </div>
                       </div>
                    </div>
                </div>
                <div className="col-md">  
                     <div className="container cf">
                       <div className={Styles.divBox}>
                       <div className="row">
                           
                       <div className="col-md-9 text-left h3" style={{ color: `var(--horizontal-menu-background-color)` }} > 
                            {(Utils.filterArrayByFieldNameAndValueAndOneObject(statistiques,"key","sumMontantFactureTodayPaid")?.value)}  {globalObject?.clinique?.config?.deviseMonetaire} 
                        </div>
                        <div className="col-md-3 text-right"> <img src="/img/facture.png" alt="profile-img" className="icone50"/></div>
                       </div>
                       <div className="row">
                         <span className="h6" > {(Utils.filterArrayByFieldNameAndValueAndOneObject(statistiques,"key","sumMontantFactureTodayPaid")?.label)} </span>
                            <span className="h6" >  {(Utils.filterArrayByFieldNameAndValueAndOneObject(statistiques,"key","sumMontantFacturePatientTodayPaid").label)}: {(Utils.filterArrayByFieldNameAndValueAndOneObject(statistiques,"key","sumMontantFacturePatientTodayPaid").value)} {globalObject?.clinique?.config?.deviseMonetaire} </span>
                          <span className="h6" >  {(Utils.filterArrayByFieldNameAndValueAndOneObject(statistiques,"key","sumMontantFactureAssureurTodayPaid").label)}:{(Utils.filterArrayByFieldNameAndValueAndOneObject(statistiques,"key","sumMontantFactureAssureurTodayPaid").value)} {globalObject?.clinique?.config?.deviseMonetaire} </span>

                       </div>
                       </div>
                    </div>
                </div>
                 <div className="col-md">  
                     <div className="container cf">
                       <div className={Styles.divBox}>
                       <div className="row">
                           
                       <div className="col-md-9 text-left h3" style={{ color: `var(--horizontal-menu-background-color)` }} > 
                        {(Utils.filterArrayByFieldNameAndValueAndOneObject(statistiques,"key","sumMontantFacturePaid")?.value)} {globalObject?.clinique?.config?.deviseMonetaire} 
                       </div>
                        <div className="col-md-3 text-right"> <img src="/img/facture.png" alt="profile-img" className="icone50"/></div>
                       </div>
                       <div className="row">
                          <span className="h6" >{(Utils.filterArrayByFieldNameAndValueAndOneObject(statistiques,"key","sumMontantFacturePaid")?.label)}</span>
                        <span className="h6" >  {(Utils.filterArrayByFieldNameAndValueAndOneObject(statistiques,"key","sumMontantFacturePatientPaid").label)}: {(Utils.filterArrayByFieldNameAndValueAndOneObject(statistiques,"key","sumMontantFacturePatientPaid").value)} {globalObject?.clinique?.config?.deviseMonetaire} </span>
                          <span className="h6" >  {(Utils.filterArrayByFieldNameAndValueAndOneObject(statistiques,"key","sumMontantFactureAssureurPaid").label)}:{(Utils.filterArrayByFieldNameAndValueAndOneObject(statistiques,"key","sumMontantFactureAssureurPaid").value)} {globalObject?.clinique?.config?.deviseMonetaire} </span>

                       </div>
                       </div>
                    </div>
                </div>                

            </div>
            )}
{(permissionCompteDeDepot!=null)&&(
  <div className="row">
             <div className="col-md">  
                     <div className="container cf">
                       <div className={Styles.divBox}>
                       <div className="row">
                           
                       <div className="col-md-9 text-left h3" style={{ color: `var(--horizontal-menu-background-color)` }} > 
                        {(Utils.filterArrayByFieldNameAndValueAndOneObject(statistiques,"key","sumMontantDepot").value)} {globalObject?.clinique?.config?.deviseMonetaire} 
                       </div>
                        <div className="col-md-3 text-right"> <img src="/img/facture.png" alt="profile-img" className="icone50"/></div>
                       </div>
                       <div className="row">
                          <span className="h6" >  {(Utils.filterArrayByFieldNameAndValueAndOneObject(statistiques,"key","sumMontantDepot").label)}</span>
                       </div>
                       </div>
                    </div>
                </div>
                <div className="col-md">  
                    
                </div>
                 <div className="col-md">  
                    
                     
                </div>                

            </div>
            )}

        </div>
            )} 
  </div>
    
  );
};

export default Statistiques;