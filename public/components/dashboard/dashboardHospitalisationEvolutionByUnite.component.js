import React, {useState, useEffect } from "react";
import DashboardsDataService from "../../services/dashboards.service";
import Utils from "../../utils/utils";
import { Button,  Modal } from 'react-bootstrap';

import globalObject from '../../global.js'

import Styles from '../../styles.module.css';



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




 /* eslint-disable */
const DashboardHospitalisationEvolutionByUnite = (props) => {

const InitiateQuery = 
     {
        "periode": "",
        "unite":""
           
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




useEffect(() => {
    retrieveHospitalisationEvolutionByUnite();
     
  }, []);

const handleQueryChange = event => {
  const { name, value } = event.target;
 setQuery({ ...query, [name]: value });
 //   console.log("query==>",query)
    retrieveHospitalisationEvolutionByUnite(value);
};


async function retrieveHospitalisationEvolutionByUnite (value){

    let resp=null;
    let q="";
   let queryObj={...query}
    if(value!=null && value!="")
   {   if(value=="3A")
        {
            q="?ans=3";
            queryObj.unite="ans"

         }
         else
            if(value=="12M")
             {
                q="?mois=12";
                 queryObj.unite="mois"
            }
            else
                if(value=="6M")
                 {
                    q="?mois=6";
                     queryObj.unite="mois"
                }
                else
                    if(value=="4S")
                     {
                        q="?semaines=4";
                         queryObj.unite="semaines"
                    }
                    else
                     if(value=="7J")
                       {
                        q="?jours=7";
                         queryObj.unite="jours"
                       }
    }else
     {
        q="?jours=7"
        queryObj.unite="jours"
        value="7J";
    } 
    queryObj.periode=value
    setQuery(queryObj);

    {/*if(props.typeSoins!=null)
        q=q+"&typeSoins="+props.typeSoins*/}
    resp= await DashboardsDataService.countHospitalisationEvolutionByUniteAsync(q); 
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
          console.log("countHospitalisationEvolutionByUniteAsync",resp.data)
        setData(obj)
         
        }else
         {
        
             setData({...InitialData})
         }  
  };




return (
   <section className="accordion">
              <input type="checkbox" name="collapse" id={`evolHospitalisationByUnite-${props.typeSoins}`} defaultChecked />
              <h2 className="handle">
                <label htmlFor={`evolHospitalisationByUnite-${props.typeSoins}`}>{props.title}</label>
              </h2>
              <div className="content row">

          <div className="form-group text-right">     
               <label> Période : </label>
              <select id="periode" name="periode" onChange={handleQueryChange} value={query.periode} >
               {/* <option disabled={false} value="">Période</option>*/}
                <option value="7J">7 derniers jours</option>
                  <option value="4S">4 dernières semaines</option>
                <option value="6M">6 derniers mois</option>
                 <option value="12M">12 derniers mois</option>
                <option value="3A">3 dernières années</option>                      
                </select>                         
          </div>
          {(data!=null&&data.datasets.length>0) ? (      
       
             <Line options={options} data={data} />
                ):(
         <div className="alert alert-secondary mt-2" role="alert">         
              <h6 className="text-danger">Aucune information de statistique disponible</h6>           
         </div>)}
          
      </div>



      </section>
  );
};
export default DashboardHospitalisationEvolutionByUnite;