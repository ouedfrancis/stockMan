import React, {useState, useEffect } from "react";
import DashboardsDataService from "../../services/dashboards.service";
import Utils from "../../utils/utils";
import { Button,  Modal } from 'react-bootstrap';



import globalObject from '../../global.js'

import Styles from '../../styles.module.css';

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);


 
 /* eslint-disable */
const HospitalisationDatas = (props) => {

const InitialOptions = {
  responsive: true,
 maintainAspectRatio: false,
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
const InitiateQuery = 
     {
        "status": ""
           
    };

const InitialDataSet = {
      label: '',
      data: [],
      backgroundColor: [],
      borderColor: [],
       borderWidth: 0,
    };


const InitialData = {
  labels:[],
  datasets: [],
   
};

   

const [query, setQuery] = useState(InitiateQuery);
const [data, setData] = useState(null); 
const [options, setOptions] = useState(InitialOptions);



useEffect(() => {
    retrieveHospitalisationDatas();
     
  }, []);

const handleQueryChange = event => {
  const { name, value } = event.target;
 setQuery({ ...query, [name]: value });
    retrieveHospitalisationDatas(value);
};


async function retrieveHospitalisationDatas (value){

    let resp=null;
    let q="";
    if(value!=null && value!="")
      q="?status="+value;
    else
      {
        value=1
         q="?status="+value;
       }
       q=q+"&actif=true"
        /*if(props.typeSoins!=null)
        q=q+"&typeSoins="+props.typeSoins*/
    resp= await DashboardsDataService.groupAndSejourByUniteAsync(q); 
    if(resp!=null && resp.status=="200" )          
        {              
             let obj={... InitialData}
                 let dataSet={...InitialDataSet}
                 dataSet.label=props.title
                 dataSet.data=resp.data.map(elt => elt.value)
                 dataSet.backgroundColor=resp.data.map(elt => Utils.stringToColor(elt.label)); 
                 dataSet.borderColor=resp.data.map(elt => Utils.stringToColor(elt.label));                   
                  obj.labels=resp.data.map(elt => elt.label),               
                 obj.datasets.push(dataSet)           
               setData(obj)
               console.log("groupAndSejourByUniteAsync",resp.data)
         
        }else
         {        
            setData({...InitialData})
         }  
  };




return (
<section className="accordion">
              <input type="checkbox" name="collapse" id={`NombreUnite-${props.typeSoins}`} defaultChecked />
              <h2 className="handle">
                <label htmlFor={`NombreUnite-${props.typeSoins}`}>{props.title}</label>
              </h2>
              <div className="content row">

          <div className="form-group text-right">  
           <label> Statut de l'hospitalisation : </label>   
              <select id="statut" name="statut" onChange={handleQueryChange} value={query.statut} >
                  {/*<option disabled={false} value="">Statut des hospitalisations</option>*/}
                   <option value="1">En cours</option>
                   <option value="2">Finalisé</option>
                 
                 {/* <option value="-1">Rdv honnoré</option>    
                   <option value="-2">Annulé</option> */}                    
                </select>                         
          </div>
          {(data!=null&&data.datasets.length>0) ? (      
        <div style={{height:"400px", Width:"400px"}}>
     <Doughnut options={options} data={data} />
</div>
            
                ):(
         <div className="alert alert-secondary mt-2" role="alert">         
              <h6 className="text-danger">Aucune information de statistique disponible</h6>           
         </div>)}
          
      </div>



      </section>
  );
};
export default HospitalisationDatas;