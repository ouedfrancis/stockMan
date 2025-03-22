import React, {useState, useEffect } from "react";
import DashboardsDataService from "../../services/dashboards.service";
import Utils from "../../utils/utils";
import { Button,  Modal } from 'react-bootstrap';
import { TextField } from '@mui/material';
import globalObject from '../../global.js'

import Styles from '../../styles.module.css';
import Select from 'react-select';


import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,

} from 'chart.js';
import { Line } from 'react-chartjs-2';


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,

);



const listConstante = [
  { value: 'temperature', label: 'Temperature' },
  { value: 'tensionArterielle', label: 'T. Arterielle' },
  { value: 'tensionArterielleGauche', label: 'T. Arterielle Gauche' },
  { value: 'tensionArterielleDroit', label: 'T. Arterielle Droit' },
  { value: 'freqCardiaque', label: 'Freq Cardiaque' },
  { value: 'freqRespiratoire', label: 'Freq Respiratoire' },
  { value: 'pouls', label: 'pouls' },
  { value: 'spo2', label: 'Sat. Oxygène' },
  { value: 'glycemie', label: 'Glycemie' },
  { value: 'poids', label: 'Poids' },
  { value: 'taille', label: 'Taille' },
  { value: 'scoreSensibilite', label: 'Score de Sensibilite' },
  { value: 'scoreMotricite', label: 'Score de Motricite' },
   { value: 'diurese', label: 'Diurese' },
  { value: 'selles', label: 'Selles' },
]

const initialConstantes = [
  { value: 'temperature', label: 'temperature' },
  /*{ value: 'pouls', label: 'pouls' },
  { value: 'tensionArterielle', label: 'tensionArterielle' },
  { value: 'tensionArterielleGauche', label: 'tensionArterielleGauche' },
  { value: 'tensionArterielleDroit', label: 'tensionArterielleDroit' },
  { value: 'freqRespiratoire', label: 'freqRespiratoire' },
  { value: 'freqCardiaque', label: 'freqCardiaque' },
  { value: 'spo2', label: 'spo2' },
  { value: 'glycemie', label: 'glycemie' }*/
]
 /* eslint-disable */
const DashboardConstantesMedicalesSelonPeriode = (props) => {

const InitiateQuery = 
     {
        "periode": "",
        "unite":"",
          "dateDebut": "",
        "dateFin": "",
        "constantes":  [ { value: 'temperature', label: 'temperature' }]
        /*["temperature","poids","taille","scoreSensibilite","scoreMotricite",
            "tensionArterielle","tensionArterielleGauche","tensionArterielleDroit","pouls",
            "diurese","selles","freqRespiratoire","freqCardiaque","spo2","glycemie"],*/
           
    };

const InitialOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: props.title,
    },
  },
};

const InitialDataSet = {
      label: '',
      data: [],
      backgroundColor: '',
       borderWidth: 1,
      
    };


const InitialData = {
  labels:[],
  datasets: [],

};

   

const [query, setQuery] = useState(InitiateQuery);
const [options, setOptions] = useState(InitialOptions);
const [data, setData] = useState(null); 
const [errorsQuery, setErrorsQuery] = useState(InitiateQuery);
const [constantes, setConstantes] = useState(InitialOptions);


useEffect(() => {
    let req={...InitiateQuery}
     let currentDate = Utils.getGMTDateTime();
    req.dateDebut=Utils.dateToString(new Date(currentDate.setDate(currentDate.getDate() -7)))
    req.dateFin= Utils.currentDate();
    setQuery(req)
    retrieveConstantesMedicalesSelonPeriode(req);
     
  }, []);

const handleQueryChange = event => {
  const { name, value } = event.target;
  let req={ ...query, [name]: value }
 setQuery(req);
 //   console.log("query==>",query)
    retrieveConstantesMedicalesSelonPeriode(req);
};


async function retrieveConstantesMedicalesSelonPeriode (queryObj){

    let resp=null;
    let q="?actif=true";


     if(props?.patientId!=null && props?.patientId!="")
      q+="&patientId="+props?.patientId;

    if(queryObj.dateDebut!=null && queryObj.dateFin!=null)
         q=q+`&dateDebut=${queryObj.dateDebut}&dateFin=${queryObj.dateFin}`; 
         let constantes=[] 
     if(queryObj?.constantes!=null&& queryObj?.constantes.length>0)
     {
        for(let elt of queryObj?.constantes)
        {
            constantes.push(elt.value)
        }
        q+="&constantes="+constantes;
     }
      


    resp= await DashboardsDataService.constantesMedicalesByPeriode(q); 
    if(resp!=null && resp.status=="200" )          
        {              
           
            let uniqLabels=Utils.filterArrayByFieldNameAndReturnUniqFieldValue(resp.data,"label");
            let listForAllLabels=[]
             let obj={... InitialData}
            for (var i=0; i<uniqLabels.length; i++)  {
               
                let listForUniqLabel=Utils.filterArrayByFieldNameAndValue(resp.data,"label",uniqLabels[i].label)
                let dataSet={...InitialDataSet}
                 dataSet.label=uniqLabels[i].label
                 dataSet.data=listForUniqLabel.map(elt => elt.value)
                 dataSet.backgroundColor=Utils.stringToColor(uniqLabels[i].label)
                 dataSet.borderColor=Utils.stringToColor(uniqLabels[i].label)
                   
                  obj.labels=listForUniqLabel.map(elt => elt.key),
                
                 obj.datasets.push(dataSet)
             

          }
          console.log("countConstantesMedicalesSelonPeriodeAsync",resp.data)
        setData(obj)
         
        }else
         {
        
             setData({...InitialData})
         }  
  };




return (
<div>
              <div className="row">
               <div className="col-md-6">
                        <div className="form-group text-left"> 
                            Période
                                              <TextField
                                                id="dateDebut"
                                                label="De"
                                                type="date" variant="standard"                    
                                                //defaultValue={query.dateDebut}                       
                                                name="dateDebut"
                                                value={query.dateDebut||''}
                                                onChange={handleQueryChange}
                                                InputLabelProps={{
                                                  shrink: true,
                                                }}
                                                className={`form-control form-control-lg ${errorsQuery.dateDebut.length>0 ? 'is-invalid' : ''}`}                   
                                                  /> 
                                                 <div className="invalid-feedback">{errorsQuery.dateDebut}</div>
                        </div>
                        <div className="form-group">
                                              <TextField
                                                id="dateFin"
                                                label="à"
                                                type="date" variant="standard"                    
                                                //defaultValue="2017-05-24"                       
                                                name="dateFin"
                                                value={query.dateFin||''}
                                                onChange={handleQueryChange}
                                                InputLabelProps={{
                                                  shrink: true,
                                                }}
                                                className={`form-control form-control-lg ${errorsQuery.dateFin.length>0 ? 'is-invalid' : ''}`}                   
                                                  /> 
                                               <div className="invalid-feedback">{errorsQuery.dateFin}</div>
                        </div>

                <div className="form-group">     
                    <Select

                       defaultValue={ query.constantes!=""?query.constantes:""}
                       getOptionLabel={e => e.label}
                        getOptionValue={e => e.value}
                        isMulti
                        isClearable={true}
                       onChange={(newValue) => { 
                             let obj={ ...query}
                                                           
                                                        
                                 console.log("newValue======",newValue)  
                                 obj.constantes=newValue                                              
                                   setQuery(obj)                             
                              retrieveConstantesMedicalesSelonPeriode(obj);
                             
                              
                              }}


                        noOptionsMessage={() => 'Aucune correspondance'}
                        options={listConstante}
                        placeholder={`selectionner les constantes`}
                        className="basic-multi-select"
                        classNamePrefix="select"
                             menuPortalTarget={document.body}
                        menuPosition={'fixed'} 
                        styles={{
                          ///.....
                          menuPortal: provided => ({ ...provided, zIndex: 9999 }),
                          menu: provided => ({ ...provided, zIndex: 9999 })
                          ///.....
                        }}
                        />                       
                      <div className="invalid-feedback">{errorsQuery?.dateFin}</div>
                    </div >




                      </div>  
         </div>  
          {(data!=null&&data.datasets.length>0) ? (      
       
             <Line options={options} data={data} />
                ):(
         <div className="alert alert-secondary mt-2" role="alert">         
              <h6 className="text-danger">Aucune information de statistique disponible</h6>           
         </div>)}
          
      </div>


  );
};
export default DashboardConstantesMedicalesSelonPeriode;