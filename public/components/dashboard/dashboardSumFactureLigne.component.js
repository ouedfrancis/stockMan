import React, {useState, useEffect } from "react";
import DashboardsDataService from "../../services/dashboards.service";
import Utils from "../../utils/utils";
import { Button,  Modal } from 'react-bootstrap';

//import {LineChart} from 'react-d3-components';

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
  Filler // 1. Import Filler plugin
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
  Filler // 1. Register Filler plugin
);



 /* eslint-disable */
const DashboardSumFactureLigne = ( props) => {

const InitialOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: props?.title,
    },
  },
   tension: 0.5, // 2. Set the tension (curvature) of the line to your liking.  (You may want to lower this a smidge.)
};

const InitialDataSet = {
      label: '',
      data: [],
      borderColor:'',
      backgroundColor: '',
      borderWidth: 1,
       //fill: true,
       fill: {
        target: "origin", // 3. Set the fill options
        //above: "rgba(255, 0, 0, 0.3)"
      },
      
  
    };


const InitialData = {
  labels:[],
  datasets: [],

};
const InitiateQuery = 
     {
        "periode": "",
        "unite":"",
        "payerPar":"PatientsAssureurs",
        
           
    };

   
const [query, setQuery] = useState(InitiateQuery);
const [options, setOptions] = useState(InitialOptions);
const [data, setData] = useState(null);

 

useEffect(() => {
    retrieveSumFactureLigne(query);
     
  }, []);

const handleQueryChange = event => {
  const { name, value } = event.target;

let queryObj={...query, [name]: value}
setQuery(queryObj);
retrieveSumFactureLigne(queryObj);

};


async function retrieveSumFactureLigne (queryObj){

    let resp=null;
    let q="";
    if(queryObj.periode!=null && queryObj.periode!="")
   {   if(queryObj.periode=="3A")
        {
            q="?ans=3";
            queryObj.unite="ans"

         }
         else
            if(queryObj.periode=="12M")
             {
                q="?mois=12";
                 queryObj.unite="mois"
            }
            else
                if(queryObj.periode=="6M")
                 {
                    q="?mois=6";
                     queryObj.unite="mois"
                }
                else
                    if(queryObj.periode=="4S")
                     {
                        q="?semaines=4";
                         queryObj.unite="semaines"
                    }
                    else
                     if(queryObj.periode=="7J")
                       {
                        q="?jours=7";
                         queryObj.unite="jours"
                       }
    }else
     {
        q="?jours=7"
        queryObj.unite="jours"
        queryObj.periode="7J";
    } 

    if(queryObj.payerPar=="PatientsAssureurs")
    q+="&payerParPatient="+props?.payer+"&payerParAssureur="+props?.payer
    else
        if(queryObj.payerPar=="Patients")
        q+="&payerParPatient="+props?.payer
        else
            if(queryObj.payerPar=="Assureurs")
            q+="&payerParAssureur="+props?.payer

    resp= await DashboardsDataService.sumFactureLigneAsync(q); 
    if(resp!=null && resp.status=="200" )          
        {              



        let obj={... InitialData}
        let label=props?.payer=="true"?"Règlements":"Impayés"
        let color=props?.payer=="true"?"red":"green"
         let dataSet={...InitialDataSet}
         dataSet.label=label
         dataSet.data=resp.data.map(elt => elt.value)
         dataSet.backgroundColor=Utils.stringToColor(color)
         dataSet.borderColor=Utils.stringToColor(color)
           
          obj.labels=resp.data.map(elt => elt.key),
        
         obj.datasets.push(dataSet)

        
         setData(obj)



      /*      let obj={}
            obj.label="Règlements"
            obj.values=[]
            for (var i=0; i<resp.data.length; i++)  {
               // console.log("elt",resp.data[i])
                let xy={}
                xy.x=parseInt(resp.data[i].key)
                xy.y=parseInt(resp.data[i].value)
                obj.values.push(xy)
              }
             //console.log("obj==>",obj)
              let list=[]
              list.push(obj) 
        SetSumFactureLignes(list);*/
          
        }else
         {
          //SetSumFactureLignes(null);
           setData({...InitialData})
          //console.log("obj==>",sumFactureLignes)
         }  
  };




return (

<section className="accordion">
              <input type="checkbox" name="collapse" id={`MontantLigne-${props.payer}`} defaultChecked />
              <h2 className="handle">
                <label htmlFor={`MontantLigne-${props.payer}`}>{props.title}</label>
              </h2>
            <div className="content row ">
               <div className="col text-right">   
         Acteur : 
              <select id="payerPar" name="payerPar" onChange={handleQueryChange} value={query.payerPar} >
               {/* <option disabled={false} value="">Période</option>*/}
                <option value="PatientsAssureurs">Patients & assureurs</option>
                  <option value="Patients">Patients</option>
                <option value="Assureurs">Assureurs</option>
                                     
                </select>                         
          </div>
          <div className="col text-right">   
           Période : 
              <select id="periode" name="periode" onChange={handleQueryChange} 
                value={query.periode} >
               {/* <option disabled={false} value="">Période</option>*/}
                <option value="7J">7 derniers jours</option>
                  <option value="4S">4 dernières semaines</option>
                <option value="6M">6 derniers mois</option>
                 <option value="12M">12 derniers mois</option>
                <option value="3A">3 dernières années</option>                     
                </select>                         
          </div>
        {(data!=null&&data.datasets.length>0) ? (      
        /* <LineChart
                data={sumFactureLignes}
                width={500}
                height={300}
                margin={{top: 10, bottom: 50, left: 50, right: 10}}
                tooltipHtml={tooltipLine}
                 xAxis={{innerTickSize: 6, label: query.unite}}
                yAxis={{label: "Montant"}}
               
                    shapeColor={"red"}
                    stroke={{strokeDasharray: dashFunc, strokeWidth: widthFunc}}     
                    />*/
            <Line options={options} data={data} />
                ):(
         <div className="alert alert-secondary mt-2" role="alert">         
              <h6 className="text-danger">Aucune information de statistique disponible</h6>           
         </div>)}
          
      </div>



      </section>
  );
};
export default DashboardSumFactureLigne;