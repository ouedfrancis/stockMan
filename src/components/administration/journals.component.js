import React, {useState, useEffect } from "react";
import JournalsDataService from "../../services/journals.service";
import UsersDataService from "../../services/security/user.service";
import Utils from "../../utils/utils";
import Styles from '../../styles.module.css';
import globalObject from '../../global.js'
import { Button,  Modal } from 'react-bootstrap';



import Select from 'react-select';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import $ from 'jquery';
import 'date-fns';
import { TextField } from '@mui/material';


 /* eslint-disable */
const journals = (props) => {

    const initialPerformState = 
     {
        "action": "",
        "result": "",
        "msg": "",
       
    };


    const initialQueryState = {
           "userId": "",
          "method": "",
            "patientId": "",
          "dateDebut": "",
          "dateFin": ""
        
};

const initialJournalState = {
    "journalId" :"",
    "uri" : "",
    "method" : "",
    "responseStatus" : 0,
    "dateCreation" : "",
    "userId" : "",
    "userName" : "",
    "currentRole" : "",
    "patientId" : "",
    "ip" : "",
    "userAgent" : "",
    "ipInfo":null
        
}; 

const initialIpInfoState = {
  "ip": null,
  "continent": "",
  "continentCode": "",
  "country": "",
  "countryCode": "",
  "region": "",
  "regionName": "",
  "city": "",
  "zip": "",
  "lat": 0,
  "lon": 0,
  "timezone": "",
  "currency": "",
  "isp": "",
  "org": "",
  "as": ""
}

const [perform, setPerform] = useState(initialPerformState);
const [errors, setErrors] = useState(initialQueryState);
const [query, setQuery] = useState({});
const [show, setShow] = useState(false);
const [journals, setJournals] = useState([]);
const [journal, setJournal] = useState(initialJournalState);
const [users, setUsers] = useState([]);

const [montantHonoraires, setMontantHonoraires] = useState({});


let searchElt="";
useEffect(() => {
    
   initQuery(); 

  }, []);


async function initQuery()
{
  let q={...initialQueryState}
     let dat=Utils.currentDate();
     query.userId=""
     query.dateDebut=dat
     query.dateFin=dat
     setQuery(query);
     retrieveUsers();
     retrieveJournals();
}
const handleClose = () => {
  setShow(false);
  let perf=perform;
  perf.result="";  
  setPerform(perf);
  //retrieveJournals();
}
const handleCloseAndReload = () => {
  setShow(false);
  let perf=perform;
  perf.result="";  
  setPerform(perf);
  //reload();
  retrieveJournals(actifJournal);
}

const handleShow = () => setShow(true);

const handleQueryChange = event => {
  const { name, value } = event.target;

  setQuery({ ...query, [name]: value });

};

function showNotif(perf)
{
setShow(false);
Utils.createNotification(perf.result,"Journalisation", perf.msg); 

setPerform(initialPerformState);      
//setErrors(initialJournalState);
}

const setDefaultDate = () => {
  //   let d=new Date();
//let today=d.getDate()+"/"+(d.getMonth()+1)+"/"+d.getFullYear();
let q={...initialQueryState}
     let dat=Utils.currentDate();
     query.userId=""
     query.method=""
     query.dateDebut=dat
     query.dateFin=dat
     setQuery(query);

  };

async function retrieveUsers (){
    let resp=null
    let q="?lite=true"
   

    resp= await UsersDataService.findAsync(q);  
  
    if(resp!=null && resp.status=="200" )          
        {
          setUsers(resp.data);   
          console.log("setUsers====>",resp.data)      
        }


}





function isValid  (obj) {
 
    let err=initialQueryState;
    let valid=true;
    //console.log(obj)
   
     if(obj.dateDebut==null || obj.dateDebut.length==0 ||(obj.dateDebut.length>0 && !Utils.validDate(Utils.formatDate(obj.dateDebut)))) 
         {
          err.dateDebut="Format de date incorrecte";
          valid=false;
     }

     if(obj.dateFin.length>0 && !Utils.validDate(Utils.formatDate(obj.dateFin)))
         {
          err.dateFin="Format de date incorrecte";
          valid=false;
     }
  setErrors(err);
    return valid;
  };




async function rechercherJournal ()  {

     if(isValid(query))
     { 
           
        retrieveJournals();
            
        }
     
  };


async function retrieveIpInfo (journal){
     console.log("retrieveIpInfo========>>",journal)
      
    if(journal?.ipInfo==null || journal.ipInfo?.ip==null || journal.ipInfo?.ip=="")
    {
        let ip=journal.ip.split(",")[0]
     let resp= await JournalsDataService.getIpInfoAsync(ip);  
    
    
    //let resp=await JournalsDataService.getAllActifAsync(); 
    if(resp!=null && resp.status=="200" &&resp.data.status=="success")          
        {

          let info=resp.data;
          info.ip=ip  
          info.userId=globalObject?.user?.id
          journal.ipInfo=info

          setJournal({...journal});
          handleShow();
          JournalsDataService.updateAsync(journal.journalId,journal)
        }else
        {
            let perf=perform
            perf.result="warning"
            perf.msg="Impossible d'obtenir le détail sur cette adresse IP"
            showNotif(perf)
        }

    }else
          handleShow();
    

}

async function retrieveJournals (){
    if ($.fn.dataTable.isDataTable('#tListOfJournal')) {
        $('#tListOfJournal').DataTable().destroy();
       
    }
    //console.log("query==>",query)
  let q="?";
      if(query.userId!=null && query.userId!="")
         q+=`&userName=${query.userId}`
     if(query.patientId!=null && query.patientId!="")
         q+=`&patientId=${query.patientId}`

  if(query.method!=null && query.method!="")
      q=q+"&method="+query.method   
        if(query.dateDebut!=null && query.dateFin!=null)
         q=q+`&dateDebut=${query.dateDebut} 00:00:00&dateFin=${query.dateFin} 23:59:59`;    
        
   
     let resp= await JournalsDataService.findAsync(q);  
    
 
    //let resp=await JournalsDataService.getAllActifAsync(); 
    if(resp!=null && resp.status=="200" )          
        {
          setJournals(resp.data);
        }else 
        setJournals([]);

 
setTimeout(()=>{                        
     $('#tListOfJournal').DataTable(

      {  dom: 'lBfrtip',//"l" to show pagelength, B for button,
        /*buttons: [
            //'copyHtml5',
           
            //'csvHtml5',
            'excelHtml5',
            'pdfHtml5',
            'print',
            'colvis'
        ],*/
        buttons: [
           /* {
                extend:    'copyHtml5',
                text:      '<i className="fa fa-files-o"></i>',
                titleAttr: 'Copy'
            },*/
            {
                extend:    'excelHtml5',
              //  text:      '<i className="fa fa-file-excel-o"></i>',
                titleAttr: 'Excel',
                title: 'Journalisation',
                autoFilter: true,
                sheetName: 'Journalisation',
                exportOptions: {
                    //columns: [ 0, ':visible' ]
                   columns: [1,2,3,4, 5,6,7,8]
                }
                
            },
            /*{
                extend:    'csvHtml5',
                text:      '<i className="fa fa-file-text-o"></i>',
                titleAttr: 'CSV'
            },*/
            {
                extend:    'pdfHtml5',
              //  text:      '<i className="fa fa-file-pdf-o"></i>',
                titleAttr: 'PDF',
                 title: 'Journalisation',
                 download: 'open',
                 exportOptions: {
                    //columns: [ 0, ':visible' ]
                    columns: [1,2,3,4, 5,6,7,8]
                }
            },
             {
                extend:    'print',
               text: 'Imprimer',
               exportOptions: {
                    //columns: [ 0, ':visible' ]
                     columns: [1,2,3,4, 5,6,7,8]
                }
            },
             
          
        ], 
        "autoWidth": false,
        "scrollX":false,
        "scrollCollapse": true,
        "order": [[ 0, "desc" ]],
        "columnDefs": [
            {
                "targets": [ 0 ],
                "visible": false,
                "searchable": false
            },
            
            { "width": "15%", "targets": 4 }
        ],
         "pageLength": 25,
         "language": {
            "lengthMenu": "Afficher _MENU_ /page",
            "zeroRecords": "Liste vide",
            "info": " page _PAGE_ sur _PAGES_ / Total (_MAX_)",
            "infoEmpty": "Aucun enregistrement trouvé",
            "infoFiltered": "(filtered from _MAX_ total records)",
            "searchPlaceholder": "Filtrer", 
            "search": "",
            'paginate': {
                    'previous': '<<',
                    'next': '>>'
                  }
          },
          "fnInitComplete": function ( oSettings ) {
               oSettings.oLanguage.sZeroRecords = "No matching records found"
           }
    }
      );

  }, 200);


  };




function updatePerform  (perf) {
  setPerform(perf);
  setShow(false);
  setShow(true);
}
const performAction = (obj, action) => {
    handleClose();
    setJournal(obj);
  
    if((action=="GET" || action=="PUT" || action=="DELETE") )
    { 
    let perf=perform;
    perf.action=action;
    setPerform(perf);
    setErrors(initialQueryState);
    handleShow();
  };
  if(action=="GET-IPINFO")
  {
    let perf=perform;
    perf.action=action;
    setPerform(perf);
    setErrors(initialQueryState);
    retrieveIpInfo(obj)
  }

}



const renderShowJournal=() =>{
return (

 <div className="row">
                <div className="col-md">   
                <div className="table-responsive">      
                <table className='table table-bordered table-sm '>
                <tbody>
                    <tr><th className="table-active">Date de creation</th><td>{journal.dateCreation}</td></tr>
                     <tr><th className="table-active">User ID</th><td>{journal.userId}</td></tr>
                    <tr><th className="table-active">User</th><td>{journal.userName}</td></tr>
                      <tr><th className="table-active">Role</th><td>{journal?.currentRole?.replace('ROLE_', '')}</td></tr>
                      <tr><th className="table-active">Patient ID</th><td>{journal.patientId}</td></tr>
                      <tr><th className="table-active">URI</th><td>{journal.uri}</td></tr>
                     <tr><th className="table-active">Method</th><td>{journal.method}</td></tr> 
                     <tr><th className="table-active">code http</th><td>{journal.responseStatus}</td></tr>
                     <tr><th className="table-active">IP</th><td>{journal.ip}</td></tr>
                     <tr><th className="table-active">user agent</th><td>{journal.userAgent}</td></tr>                               
                </tbody>
              </table>
                           
              </div>
            </div>
          </div>
  )}


const renderShowIpInfo=() =>{
return (

 <div className="row">
                <div className="col-md">   
                <div className="table-responsive">      
                <table className='table table-bordered table-sm '>
                <tbody>
                    <tr><th className="table-active">IP</th><td>{journal?.ipInfo?.ip}</td></tr>
                  <tr><th className="table-active">Continent</th><td>{journal?.ipInfo?.continent}({journal?.ipInfo?.continentCode})</td></tr>
                  <tr><th className="table-active">Pays</th><td>{journal?.ipInfo?.country}({journal?.ipInfo?.countryCode})</td></tr>
                  <tr><th className="table-active">Région</th><td>{journal?.ipInfo?.regionName}({journal?.ipInfo?.region})</td></tr>
                   <tr><th className="table-active">Ville</th><td>{journal?.ipInfo?.city}({journal?.ipInfo?.zip})</td></tr>
                   <tr><th className="table-active">Longitude/Latitude</th><td>{journal?.ipInfo?.lon}/{journal?.ipInfo?.lat}</td></tr>
                    <tr><th className="table-active">Opérateur</th><td>{journal?.ipInfo?.isp}</td></tr>
                    <tr><th className="table-active">TimeZone</th><td>{journal?.ipInfo?.timezone}</td></tr>
                    <tr><th className="table-active">Dévise</th><td>{journal?.ipInfo?.currency}</td></tr>                              
                </tbody>
              </table>
                           
              </div>
            </div>
          </div>
  )}


/*********************************************RENDER*******************************************/

const renderListJournals=() =>{

return (
<div className="table-responsive">   
     
      <table id="tListOfJournal" className="table table-striped table-bordered display compact "  >
          <thead>
            <tr>
              <th>Date de creation</th>
              <th>Date de creation</th>
              <th>User</th>
               <th>Role</th>
               <th>URI</th>
              
              <th>Method</th>
              <th>Réponse</th>
               <th>IP</th>
               <th>Dossier Patient</th>
               <th>Actions</th>          
            </tr>
          </thead>
          <tbody>
           {journals &&
            journals.map((item, index) => (
                <tr key={index}>  
                 <td>{item.dateCreation}</td> 
                 <td>{item.dateCreation}</td>
                  <td>{item.userName}</td>    
                <td>{item?.currentRole?.replace('ROLE_', '')}</td>  
                 <td>{item.uri}</td>  
                  <td>{item.method}</td>  
                   {item.responseStatus<400 ?(<td>{item.responseStatus}</td>): ((item.responseStatus==400 || item.responseStatus==409|| item.responseStatus==403)? (<td style={{color:"orange"}}>{item.responseStatus}</td>):(<td style={{color:"red"}}>{item.responseStatus}</td>))}
                    <td>
               <a href={'https://whatismyipaddress.com/ip/'+item.ip} target="_blank" rel="noreferrer">{item.ip.split(",")[0]} </a>
                 {/*  <a href={'#'}  onClick={() => performAction(item, "GET-IPINFO")}>{item.ip.split(",")[0]} </a>*/}
                    </td>
                   
                    <td>{item.patientId!=null?"Oui":"Non"} </td>    
                     <td>
                     <img src="/img/read.png" title="Voir details"  alt="Voir details" className="icone-action"
                      onClick={() => performAction(item, "GET")}/> 
                    
                   </td>   
                </tr>
          ))}        
          </tbody>         
        </table>        
        </div>
   )
}

const renderRechercheJournal=() =>{
return (

<div className="container">


<div className="col-md-6 " >Rechercher

<div className="row border border-secondary p-2" >

    <div className="col-md-4" >
    
                                <div className="form-group"> 
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
                                                className={`form-control form-control-lg ${errors.dateDebut.length>0 ? 'is-invalid' : ''}`}                   
                                                  /> 
                                                 <div className="invalid-feedback">{errors.dateDebut}</div>
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
                                                className={`form-control form-control-lg ${errors.dateFin.length>0 ? 'is-invalid' : ''}`}                   
                                                  /> 
                                               <div className="invalid-feedback">{errors.dateFin}</div>
                                            </div>
                  

        </div>
         <div className="col-md-8" >

    
              <div className="form-group">             
                      <Select
                       defaultValue={query.userId}
                       getOptionLabel={e => e.username}
                        getOptionValue={e => e.id}
                        isClearable={true}
                       onChange={(e) => {
                        let q={...query};
                        if(e!=null)       
                            q.userId=e.username
                          else
                             q.userId=""
                         
                           setQuery(q)
                            //console.log(q);
                        }}
                        options={users}
                        placeholder={'Utilisateur'}
                        className={`${errors.userId.length>0 ? 'is-invalid' : ''}`}
                        />
                       <div className="invalid-feedback">{errors.userId}</div>
                    </div>

                    <div className="form-group">             
                      <input
                        type="text"
                        className="form-control"
                        id="patientId"
                        required
                        value={query.patientId}
                        onChange={handleQueryChange}
                        name="patientId"
                        placeholder="ID du Patient"
                        maxLength="50"
                        className={`form-control form-control-sm ${errors.patientId.length>0 ? 'is-invalid' : ''}`}
                      />
                    </div>
                  <div className="form-group">     
                   <select id="method" name="method" onChange={handleQueryChange} value={query.method}  className={`form-control form-control-sm ${errors.method.length>0 ? 'is-invalid' : ''}`}>
                      <option disabled={false} value="">Methode HTTP</option>
                       <option value="GET">GET</option>
                      <option value="POST">POST</option>
                      <option value="PUT">PUT</option>
                        <option value="DELETE">DELETE</option>
                      
                   </select>        
                 
                      <div className="invalid-feedback">{errors.method}</div>
                    </div>
                    <div className="col-md align-self-end" >
                    <i className="fa fa-search btn-search" onClick={() => rechercherJournal(query)}/> 
                        
         
                    </div>
                        <div className="text-danger" style={{ fontSize:"12px"}}>{errors.remarque}</div>
        </div>
     
 
    </div>

</div>

</div>
  )}





return (


<div className="container" > 
  
      
  <header className="jumbotron">
       <h3 className={Styles.HeaderL1} >Historique des actions </h3>
       <div className="container-body">
     {(renderRechercheJournal())}
    
    <div className="submit-form">
    <div className="text-right">
     <Button  variant="info" className="btn-sm" 
                       title="Rafraichir" onClick={() => retrieveJournals()}>
                      <i className="fa fa-refresh"></i>
            </Button>

      
    </div>
      <Modal  centered show={show} onHide={()=>handleClose} animation={false} dialogClassName={`${perform.result.length>0 ? 'modal-30vw' : 'modal-30vw'}`}>
       <Modal.Header>
          <Modal.Title>
        
          {
          (perform.action=="GET")? "Détail sur le journal":         
         ""} </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {(perform.result.length>0)? (
            <div className="alert alert-secondary mt-2" role="alert"> 
            
             {(perform.result=="OK")? (
              <h4 className="text-success">{perform.msg}</h4>)
             :(<h4 className="text-danger">{perform.msg}</h4>)}
              
            </div>
          ): ( (perform.action=="GET" )?(
                  renderShowJournal()
              ):(perform.action=="GET-IPINFO" )&&(
                  renderShowIpInfo()
              ))}

          
        </Modal.Body>
        <Modal.Footer>
         
        {(perform.result!="") ?
          <Button variant="secondary" onClick={handleCloseAndReload}>
            Fermer
          </Button>:
          <Button variant="secondary" onClick={handleClose}>
            Fermer
          </Button>
        }
        </Modal.Footer>
      </Modal>
  
    </div>
   
    {renderListJournals()}
  
      </div>
      </header>
</div>

  );
};
let actifJournal=true;
export default journals;