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
const TypeExamenDatas = (props) => {

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
        "statut": ""
           
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
    retrieveTypeExamenDatas();
     
  }, []);

const handleQueryChange = event => {
  const { name, value } = event.target;
 setQuery({ ...query, [name]: value });
    retrieveTypeExamenDatas(value);
};


async function retrieveTypeExamenDatas (value){

    let resp=null;
    let q="";
    if(value!=null && value!="")
      q="?statut="+value;
    else
      {
        value=1
         q="?statut="+value;
       }
        if(props.typeSoins!=null)
        q=q+"&typeSoins="+props.typeSoins
    resp= await DashboardsDataService.groupAndCountExamenByTypeExamenAsync(q); 
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
               console.log("groupAndCountExamenByTypeExamenAsync",resp.data)
         
        }else
         {        
            setData({...InitialData})
         }  
  };




return (
<section className="accordion">
              <input type="checkbox" name="collapse" id={`NombreDeTypeSoin-${props.typeSoins}`} defaultChecked />
              <h2 className="handle">
                <label htmlFor={`NombreDeTypeSoin-${props.typeSoins}`}>{props.title}</label>
              </h2>
              <div className="content row">

          <div className="form-group text-right">  
           <label> Statut de la consultation : </label>   
              <select id="statut" name="statut" onChange={handleQueryChange} value={query.statut} >
                  {/*<option disabled={false} value="">Statut de la consultation</option>*/}
                   <option value="1">Prescrit</option>
                   <option value="2">En cours de réalisation</option>
                   <option value="3">Réalisés</option>
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
export default TypeExamenDatas;