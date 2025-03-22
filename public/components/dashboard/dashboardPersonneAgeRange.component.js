import React, {useState, useEffect } from "react";
import DashboardsDataService from "../../services/dashboards.service";
import Utils from "../../utils/utils";
import { Button,  Modal } from 'react-bootstrap';

//import {BarChart} from 'react-d3-components';

import globalObject from '../../global.js'

import Styles from '../../styles.module.css';




import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

import { Bar } from 'react-chartjs-2';


ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);



 /* eslint-disable */
const DashboardPersonnesAgeRange = (props) => {

const InitialOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: "Répartition des patients par tranche d'age",
    },
  },
};

const InitialDataSet = {
      label: '',
      data: [],
      backgroundColor: '',
      
    };

const labels = [];
const InitialData = {
  labels:[],
  datasets: [],
};

    const InitiateQuery = 
     {
        "sexe": ""
           
    };

const [query, setQuery] = useState(InitiateQuery);
const [options, setOptions] = useState(InitialOptions);
const [data, setData] = useState(null);



useEffect(() => {
    retrievePersonnesAgeRange();
     
  }, []);

const handleQueryChange = event => {
  const { name, value } = event.target;
 setQuery({ ...query, [name]: value });
 //   console.log("query==>",query)
    retrievePersonnesAgeRange(value);
};


async function retrievePersonnesAgeRange (value){

    let resp=null;
   
    let dataSetLabels=[]
    if(value!=null && (value=="Masculin" || value=="Feminin" || value=="Intersexe"))
     {
        dataSetLabels.push(value)
     } 
    else
        if(value!=null && value=="BySexe")
         {         
            dataSetLabels=["Masculin","Feminin","Intersexe"]
             
        }

    
    let responses=[]
    if(dataSetLabels.length>0)
    {
        for (var i=0; i<dataSetLabels.length; i++)  {
        resp= await DashboardsDataService.groupAndCountByPersonneAgeAndOrSexeAsync("?sexe="+dataSetLabels[i]); 
        if(resp!=null && resp.status=="200" )          
        {
            responses.push(resp.data)
        }
     } 
    }else
    {
         resp= await DashboardsDataService.groupAndCountByPersonneAgeAndOrSexeAsync(""); 
        if(resp!=null && resp.status=="200" )          
        {
            responses.push(resp.data)
            dataSetLabels.push("Tous les sexes")
        }
    }
   

     if(responses.length>0)
     {
        let obj={... InitialData}
        obj.labels=responses[0].map(elt => elt.label+" ans")
       
           for (var i=0; i<responses.length; i++)  {
           let  dataSet={...InitialDataSet}
            dataSet.label=dataSetLabels[i]
            dataSet.data=responses[i].map(elt => elt.value)
            //console.log("dataSet"+ i+"===>"+dataSetLabels[i],responses[i])
            dataSet.backgroundColor=Utils.stringToColor(dataSetLabels[i])   
            obj.datasets.push(dataSet)

           }

        setData(obj)
     }else

     setData({...InitialData})
  };




return (
      


<section className="accordion">
              <input type="checkbox" name="collapse" id="PersonneAgeRange" defaultChecked />
              <h2 className="handle">
                <label htmlFor="PersonneAgeRange">Répartition des patients par tranche d'age</label>
              </h2>
              <div className="content row">
          <div className="form-group text-right">
           <label> Répartition : </label>
              <select id="sexe" name="sexe" onChange={handleQueryChange} value={query.sexe} >
                <option disabled={false} value="">Tous les sexes</option>
                <option value="BySexe">Par Sexe</option>
                {/*<option value="Masculin">Masculin</option>
                <option value="Feminin">Feminin</option>
                <option value="Intersexe">Intersexe</option>  */}                   
                </select>                         
          </div>
          
          {(data!=null) ? (      
         
              
                 <Bar  options={options} data={data} />
         

                ):(
         <div className="alert alert-secondary mt-2" role="alert">         
              <h6 className="text-danger">Aucune information de statistique disponible</h6>           
         </div>)}
          
      </div>



      </section>
  );
};
export default DashboardPersonnesAgeRange;