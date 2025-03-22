import React, { Component } from "react";

import globalObject from '../../global.js'

import Styles from '../../styles.module.css';


import DashboardHospitalisationEvolutionByUnite from "./dashboardHospitalisationEvolutionByUnite.component";
import DashboardTypeConsultation from "./dashboardTypeConsultation.component";
import DashboardTypeExamen from "./dashboardTypeExamen.component";
import DashboardHospitalisationSelonUnite from "./dashboardHospitalisationSelonUnite.component";
import DashboardPersonneAgeRange from "./dashboardPersonneAgeRange.component";
import DashboardConsultationEvolutionByTypeConsultation from "./dashboardConsultationEvolutionByTypeConsultation.component";
import DashboardSumFactureLigne from "./dashboardSumFactureLigne.component";
import DashboardExamenEvolutionByTypeExamen from "./dashboardExamenEvolutionByTypeExamen.component";
import DashboardPersonneEvolutionBySexe from "./dashboardPersonneEvolutionBySexe.component";
//import BarChart from './barChart.component';
//import PieChart from './pieChart.component';
import Utils from "../../utils/utils";
export default class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
        permissionPatient:Utils.trouverObjetDansListObject(globalObject?.permissions,"ressource","DASHBOARD/FICHE_PATIENT"),
        permissionConsultation:Utils.trouverObjetDansListObject(globalObject?.permissions,"ressource","DASHBOARD/CONSULTATION"),
        permissionSoin:Utils.trouverObjetDansListObject(globalObject?.permissions,"ressource","DASHBOARD/SOIN"),
        permissionRdv:Utils.trouverObjetDansListObject(globalObject?.permissions,"ressource","DASHBOARD/RDV"),
        permissionHospitalisation:Utils.trouverObjetDansListObject(globalObject?.permissions,"ressource","DASHBOARD/HOSPITALISATION"),
        permissionLit:Utils.trouverObjetDansListObject(globalObject?.permissions,"ressource","DASHBOARD/LIT"),
        permissionExamen:Utils.trouverObjetDansListObject(globalObject?.permissions,"ressource","DASHBOARD/ANALYSE_MEDICALE"),
        permissionExamenResultat:Utils.trouverObjetDansListObject(globalObject?.permissions,"ressource","DASHBOARD/RESULTAT_ANALYSE_MEDICALE"),
        permissionFacture:Utils.trouverObjetDansListObject(globalObject?.permissions,"ressource","DASHBOARD/FACTURE"),
        permissionHReglementFacture:Utils.trouverObjetDansListObject(globalObject?.permissions,"ressource","DASHBOARD/REGLEMENT_FACTURE"),
        permissionEntrepot:Utils.trouverObjetDansListObject(globalObject?.permissions,"ressource","DASHBOARD/ENTREPOT"),

    };

    
  }

  componentDidMount() {

    
  }



render() {

     const { permissionPatient,permissionConsultation,permissionSoin,permissionRdv,
     permissionHospitalisation,permissionLit,permissionExamen,permissionExamenResultat,
     permissionFacture,permissionHReglementFacture,permissionEntrepot} = this.state;

    return (
      <div className="container">
        <header className="jumbotron">   
<div className={Styles.HeaderL1}>Tableau de bord</div>
{(permissionPatient!=null)&&(
 <div className="row">
            <div className="col-md-6">             
                    <DashboardPersonneAgeRange/>
            </div>
            <div className="col-md-6">  
                 <DashboardPersonneEvolutionBySexe title="Nombre de nouveaux patients sur une période"  />
            </div>
        </div> )}
{(permissionFacture!=null||permissionHReglementFacture!=null)&&(

 <div className="row">
             {permissionFacture!=null&&
        <div className="col-md-6">             
                     <DashboardSumFactureLigne key="001" payer="false" title="Montant des Impayés selon la période de facturation" />
            </div>}
             {permissionHReglementFacture!=null&&           
            <div className="col-md-6">  
                 <DashboardSumFactureLigne  key="002" payer="true"  title="Montant des règlements sur une période" />
            </div>}
        </div>  
    )}
{(permissionConsultation!=null)&&(
 <div className="row">
           
            <div className="col-md-6">             
                  <DashboardTypeConsultation  typeSoins="Consultation"  title="Répartition des consultations"/> 
            </div>
                 
            <div className="col-md-6">  
                 <DashboardConsultationEvolutionByTypeConsultation typeSoins="Consultation" title="Répartition des consultations sur une période" />
            </div>
            
           
        </div>)}
{(permissionSoin!=null)&&(  
    <div className="row">
                 
            <div className="col-md-6">             
                  <DashboardTypeConsultation  typeSoins="Technique"  title="Répartition des soins"/> 
            </div>
                     
            <div className="col-md-6">  
                 <DashboardConsultationEvolutionByTypeConsultation typeSoins="Technique" title="Répartition des soins sur une période" />
            </div>        
        </div>)} 
{(permissionExamen!=null||permissionExamenResultat!=null)&&(

 <div className="row">
        {permissionExamen!=null&&
            <div className="col-md-6">             
                  <DashboardTypeExamen  typeSoins="Examen"  title="Répartition des examens"/> 
            </div>}
            {permissionExamenResultat!=null&&
            <div className="col-md-6">  
                 <DashboardExamenEvolutionByTypeExamen typeSoins="Examen" title="Répartition des examens sur une période" />
            </div>}        
        </div>  
        )}      
{(permissionHospitalisation!=null||permissionLit!=null)&&(
         <div className="row">
             {permissionHospitalisation!=null&&       
            <div className="col-md-6">             
                  <DashboardHospitalisationSelonUnite  typeSoins="Hospitalisation"  title="Répartition des hospitalisations par unité"/> 
            </div>}
            {permissionLit!=null&&
            <div className="col-md-6">  
                 <DashboardHospitalisationEvolutionByUnite typeSoins="Hospitalisation" title="Répartition des hospitalisations sur une période selon l'unité" />
            </div>}

          
        </div>)} 





        </header>
      </div>
    );
  }
}
