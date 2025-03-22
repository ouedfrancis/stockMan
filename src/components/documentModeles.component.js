import React, {useState, useEffect, useCallback } from "react";
import DocumentModelesDataService from "../services/documentModeles.service";
import Utils from "../utils/utils";
import FileService from "../services/file.service";
import PersonnelsDataService from "../services/personnels.service";
import LoadFiles from "../components/loadFiles.component";
import { Button,  Modal } from 'react-bootstrap';
import ModelesDataService from "../services/modeles.service";
import globalObject from '../global.js'
import Select from 'react-select';

import 'date-fns';
import { TextField } from '@mui/material';
import draftToHtml from "draftjs-to-html";
import PdfRender from "../components/pdf/PdfRender.component";
import ReactDOMServer from 'react-dom/server';


/**********autocomplete**********/
import Autocomplete from '@mui/lab/Autocomplete';

import { Editor } from "@tinymce/tinymce-react";
import $ from 'jquery'; 


 /* eslint-disable */
const DocumentModeles = (props) => {

/*Create documentModele code*/
const initialDocumentModeleState = 
    { 

       "documentModeleId": null,
        "modeleId": null,
        "typeModele": "",
        "patientId": null,
        "emeteurId": null,
        "emeteur": "",
        "contenu": "",
        "titre": "",
        "dateRealisation":"",
        "dateDebut":"", 
        "dateFin":"", 
        "pieceJointes": [],
        "remarque": "",
        "actif": true,
        "dateCreation": null,
        "dateModif":null,
        "userId": null

    };


    const initialPerformState = 
     {
        "action": "",
        "result": "",
        "msg": "",      
    };

  const initialSelectedFile = 
    { 

       "id": "",
       "data": "",
       "name":""
    };


const [documentModele, setDocumentModele] = useState(initialDocumentModeleState);
const [documentModeles, setDocumentModeles] = useState([]);
const [perform, setPerform] = useState(initialPerformState);
const [errors, setErrors] = useState(initialDocumentModeleState);
const [showDocumentModeleModal, setShowDocumentModeleModal] = useState(false);
const [selectedFiles, setSelectedFiles] = useState([]);
const [showLoading, setShowLoading] = useState(false);
const [modeles, setModeles] = useState([]);

const [showPdf, setShowPdf] = useState(false);
const [existeDateDebut, setExisteDateDebut] = useState(false);
const [existeDateFin, setExisteDateFin] = useState(false);
const [personnel, setPersonnel] = useState(null);

const  permission=Utils.trouverObjetDansListObject(globalObject?.permissions,"ressource","DOSSIER_PATIENT/CERTIFICAT");

useEffect(() => {
   
  // console.log("DocumentModeles props",props)
    if(props.patient!=null && props.patient.personne!=null)
    {
       input.patientId=props.patient.personne.personneId ; 
       input.emeteurId=globalObject.user.personnelId; ; 

       input.patientIdInfo=props.patient.personne.nom +" "+props.patient.personne.prenoms ; 
    }
    retrieveDocumentModeles();
    retrieveModeles();
     

  }, []);




const handleCloseDocumentModeleModal = () => {
  setShowDocumentModeleModal(false);
  let perf=perform;
  perf.result="";  
  setPerform(perf);
  setShowPdf(false)
  setExisteDateDebut(false)
  setExisteDateFin(false)
  retrieveDocumentModeles()
}
const handleCloseAndReloadDocumentModele = () => {
setShowDocumentModeleModal(false);
setErrors(initialDocumentModeleState);
retrieveDocumentModeles();
}

function showNotif(perf)
{
 Utils.createNotification(perf.result,"Certificat & lettres", perf.msg);                         
handleCloseAndReloadDocumentModele()
}
const handleActifdocumentModeleChange = (event) => {
  //let act=event.target.checked;
  showAllDocumentModeles=event.target.checked;
  retrieveDocumentModeles();
}




//const today=new Date();
const handleDocumentModeleChange = event => {
  const { name, value } = event.target;
  setDocumentModele({ ...documentModele, [name]: value });
};

  

const handleLoadFiles  = useCallback((label, returnedFiles) =>{
//console.log("returnedFiles",returnedFiles);
setSelectedFiles(returnedFiles)

},[selectedFiles]);


async function retrievePersonnels (id){
    let  query=`actif=true&personne=true`;   
    

    let resp= await PersonnelsDataService.findPersonnelByIdAsync(id); 
          
    if(resp!=null && resp.status=="200" )          
        {
          
          setPersonnel(resp.data)
          console.log("retrievePersonnels",resp.data)
        
        }else 
        {         
           setPersonnel(null)
                 
        }
}


async function retrieveModeles (){
    let  query=`?typeModeles=Lettre&typeModeles=Certificat&actif=true`;   
    

    let resp= await ModelesDataService.findAsync(query); 
          
    if(resp!=null && resp.status=="200" )          
        {
          
          setModeles(resp.data)
          //console.log("retrieveModeles",resp.data)
        
        }else 
        {         
           setModeles([])
                 
        }
}
async function retrieveDocumentModeles (){

  if ($.fn.dataTable.isDataTable('#tListOfdocumentModele')) {
        $('#tListOfdocumentModele').DataTable().destroy();
       
    }
    
      
      let resp=null;
      let query="";
     /* if(input.patientId!=null && input.emeteurId!=null)
         query=`?emeteurId=${input.emeteurId}&patientId=${input.patientId}`;
       else*/
        
           query=`?patientId=${input.patientId}&actif=true`;
     /* if(showAllDocumentModeles==false)
      {
        query=query+`&actif=true`;         
      }*/
      resp= await DocumentModelesDataService.findAsync(query);  
      if(resp!=null && resp.status=="200" )          
          {
            setDocumentModeles(resp.data);
            //console.log("setDocumentModeles",resp.data)
            
          }else 
           setDocumentModeles([])
   

setTimeout(()=>{ 
    //$('#tListOfdocumentModele').DataTable().destroy();                       
    $('#tListOfdocumentModele').DataTable(

      {
        
        "autoWidth": false,
       
        "scrollX":false,
        "scrollCollapse": false,
        "order": [[ 0, "desc" ]],
        "columnDefs": [
            {
                "targets": [ 0 ],
                "visible": false,
                "searchable": false
            },
           //  { "width": "30%", "targets": 3 }
        ],
        "pageLength": "5",
        "dom": "rfltip",
       responsive: true,
        destroy: true,
         "language": {
            "lengthMenu": "Afficher _MENU_ /page",
            "zeroRecords": "Il n'existe aucun enregistrement ",
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
      //init Datatable  

async function saveDocumentModele (documentModele,print)  {
 const obj = {...documentModele};
   //setDocumentModele(obj);
   obj.patientId=input.patientId;
   //obj.professionnelDeSanteId=input.patientIdInfo;
   obj.emeteurId=input.emeteurId;
   obj.userId=globalObject?.user?.id
   var perf=perform;
     if(isValid(obj))
     {       
     
    


        let existFiles=[]
        if(selectedFiles.length>0)
        {  let newFiles=[]
            
            
            for( const file of selectedFiles)
            {
              if(file.id==null || file.id=="")
              {
                newFiles.push(file.data)
              }else 
              existFiles.push(file.id)
            }

            if(obj.pieceJointes.length>0 && existFiles.length>0 )
                {
                  let removedFiles = obj.pieceJointes.filter(x => !existFiles.includes(x));
                  if(removedFiles.length>0)
                  {
                    let query=""
                    let response=null;
                     for(const fileId of removedFiles)
                        query=query+"&fileId="+fileId
                      setShowLoading(true);
                      response= await FileService.deleteMultileFilesAsync(query);   
                      setShowLoading(false);  
                      if(response==null || response.status!="200")
                       {
              
                         perf.result="error"; 
                         if(response!=null)
                         perf.msg= response.data.message;
                       else
                         perf.msg="ERREUR inattendue s'est produite. Veillez contacter l'administrateur de l'appliaction";
                          showNotif(perf);

                       }
                  }
                }

            if(perf.result!="error" )
            {
                          
                if (newFiles.length>0)
                {
                  setShowLoading(true);
                    let listFileinfo= await FileService.createMulipleFilesAsync(newFiles, obj.typeModele,`Personne concernée :${obj.patientId} \n  Nom et prenoms: ${obj.patientIdInfo} \n libellé du documentModele: ${obj.contenu}`);     
                  setShowLoading(false);
                  if(listFileinfo!=null && listFileinfo.status=="201")
                   {
                    for( const file of listFileinfo.data)
                      existFiles.push(file.fileId);                  
                   }else
                    {                
                     perf.result="error"; 
                     if(listFileinfo!=null && listFileinfo.status!="201")
                     perf.msg="ERREUR "+listFileinfo.status + " : "+ listFileinfo.data.message;
                    else
                      perf.msg="ERREUR inattendue s'est produite. Veillez contacter l'administrateur de l'appliaction";
                      showNotif(perf);

                   }
                 }

            }
          }
          if(perf.result!="error" )
          {           
            obj.pieceJointes= existFiles;
            let response="";
            if(obj.documentModeleId!=null && obj.documentModeleId!="")
              response= await DocumentModelesDataService.updateAsync(obj.documentModeleId,obj);
            else
              response= await DocumentModelesDataService.createAsync(obj);

            if(response!=null && (response.status=="200" || response.status=="201"))
              {
                //vac=person.data;
                setDocumentModele(response.data);             
                perf.result="success";
                if(perf.action=="POST")
                  perf.msg="Enregistrement effectué avec succès" 
                else
                  perf.msg="Mise à jour effectuée avec succès" 
                if(print==null)
                 showNotif(perf);  
               else
                 {
                  Utils.createNotification(perf.result,"DocumentModele", perf.msg);  
                  setShowPdf(true)
                 }   
                
                 //props.handleToUpdatePatient();                            
              }  
             else
             {    

                perf.result="error";
                if(response!=null && response.status!=null)
                perf.msg= response.data.message;    
                else 
                    perf.msg="Une erreur inattendue s'est produite. Veillez contacter l'administrateur de l'appliaction.";         
                  
                showNotif(perf);      
             }                      
          }
      } 
  };

async function deleteDocumentModele(obj) {
  obj.userId=globalObject?.user?.id
  if(obj.documentModeleId!=null && obj.documentModeleId!="")
  {
      obj.actif=false;
      let perf=perform;
    let response=await DocumentModelesDataService.updateAsync(obj.documentModeleId,obj);
    if(response!=null && response.status=="200")
      {
          //setDocumentModele(response.data);             
          perf.result="success";
          perf.msg="Suppression effectué avec succès"  
                                        
      } 
        else
        {
           
              perf.result="error";
              perf.msg= response.data.message;
              
        }
        showNotif(perf);    
      
        //props.handleToUpdatePatient();
    }
  };




function isValid  (obj) {
 
    let err=initialDocumentModeleState;
    let valid=true;
      //console.log("documentModele",obj); 
      
    if( obj.typeModele==null || obj.typeModele.length<2) 
       {
         err.typeModele="Choisir le type de correspondance";
         valid=false;
     } 
      if( obj.titre==null || obj.titre.length<2) 
       {
         err.titre="L'object de la correspondance incorrecte";
         valid=false;
     } 
   if( obj.contenu==null || obj.contenu.length<2) 
       {
         err.contenu="Saisir le libellé du documentModele";
         valid=false;
     } 
       
      
   if(obj.dateDebut!=null &&(obj.dateDebut.length>0 && !Utils.validDate(Utils.formatDate(obj.dateDebut)))) 
         {
          err.dateDebut="Format de date incorrecte";
          valid=false;
        }
        if(obj.dateFin!=null &&(obj.dateFin.length>0 && !Utils.validDate(Utils.formatDate(obj.dateFin)))) 
         {
          err.dateFin="Format de date incorrecte";
          valid=false;
        }
   /*  if(showAllDocumentModeles==true)
     if(obj.actif==null || obj.actif.length<2) 
         {
          err.actif="indiquer le statut actif oui ou non ";
          valid=false;
     }

     if( selectedFiles.length==0) 
       {
         err.remarque="Au moins un fichier est nécessaire";
         valid=false;
     }*/
 
    // console.log(err);
    setErrors(err);

    return valid;

  };


async function getListofFiles (query ){
    let response=null; 
      
    response= await FileService.getFilesAsync(query);
     if(response!=null && response.status=="200" ) 
     {    
        if(response.data!=null && response.data!="")
          {

                   let files=[]
                     for( const file of response.data)
                     {
                      //console.log(file)
                      let item={}
                      item.id=file.fileId
                      item.data=`data:${file.fileType};base64,${file.fileData}`
                      //new File([`${file.fileData}`],`${file.fileName}`, {type:`${file.fileType}`}); 
                      //;
                      item.name=file.fileName
                      //
                      //
                      
                      files.push(item)
                     }
                     setSelectedFiles(files)
          }       
          else
                {
                  let perf=initialPerformState
                       perf.result="error";
                    if(response!=null && response.status!=null)
                    perf.msg= response.data.message;    
                    else 
                        perf.msg="Une erreur inattendue s'est produite. Veillez contacter l'administrateur de l'appliaction.";           
                    showNotif(perf);
                }
         
      }
    }

const performAction = async(obj,action) => {
  let perf=null;
  if(action=="POST")
  {
    setDocumentModele(initialDocumentModeleState);
    setSelectedFiles([]);
    //setDocumentModele({...documentModele,"contenu":modeles[0]?.description})
    //console.log("documentModeles[0]?.description",modeles[0])
    perf=initialPerformState;
    perf.action=action;   
    //updatePerform(perf);
  }else
  {
    if(action=="GET")
        retrievePersonnels(obj.emeteurId)

     if(obj.pieceJointes.length>0)
      {

        let listOfFileId=[]
        for(const file of selectedFiles)
        {
           listOfFileId.push(file.id)
        }
        //console.log("listOfFileId", listOfFileId)
        //console.log("documentModele.pieceJointes", documentModele.pieceJointes)
       if(obj.pieceJointes.length!=listOfFileId.length || obj.pieceJointes.sort().toString()!=listOfFileId.sort().toString())
       {
        setShowLoading(true);
          let query=""
          
         for(const fileId of obj.pieceJointes)
           {
            query=query+"&fileId="+fileId
           }   

           
            await getListofFiles(query)
          setShowLoading(false);
        }
              
       }else 
       setSelectedFiles([]); 
      // 
    perf=perform;
    perf.action=action;
    handleCloseDocumentModeleModal();
    setDocumentModele(obj);        
    /*handleShowDocumentModeleModal();
    
    updatePerform(perf);*/
    }
    setErrors(initialDocumentModeleState);
    updatePerform(perf);
    
    
  };

function updatePerform  (perf) {
  setPerform(perf);
  setShowDocumentModeleModal(false);
  setShowDocumentModeleModal(true);
}

const handleCloseLoading = () => {
  setShowLoading(true);
}

const loading =()=> {
return (
<div className="container">        

      <Modal  centered show={showLoading} onHide={handleCloseLoading} animation={true} dialogClassName='modal-loading' >
        <Modal.Body>
           <img src="/img/loading.gif" title="Chargement"  alt="Chargement en cours" className="profile-img-card"/>
           Traitement en cours...veillez patienter
        </Modal.Body>
        
      </Modal>
</div>)
}



const renderFormDocumentModele=() =>{
  //console.log("selectedFiles",selectedFiles)
return (

  <div className="row">
 
                <div className="col-md">                               
                                
                      <div className="form-group">             
                      <Select
                       defaultValue={documentModele!=null&&documentModele.typeModele!=""?{"nomModele":documentModele.titre,"typeModele":documentModele.typeModele} :""}
                       getOptionLabel={e => e.nomModele}
                        getOptionValue={e => e.nomModele}
                        isClearable={true}
                       onChange={(e) => {
                        let obj={...documentModele};
                        if(e!=null)       
                            {
                              obj.titre=e.libelleRegroupement
                              obj.typeModele=e.typeModele
                              obj.modeleId=e.modeleId

                              const correction = 
                                { 
                                   "PATIENT_AGE":Utils.calculateAgeYear(props?.patient?.personne?.dateNaissance),
                                   "PATIENT_DATE_NAISSANCE":Utils.formatDate(props?.patient?.personne?.dateNaissance), 
                                   "PATIENT_VILLE_NAISSANCE":props?.patient?.personne?.lieuNaissance?.nomVille, 
                                   "PATIENT_SEXE":props?.patient?.personne?.sexe, 
                                   "PATIENT_CIVILITE":props?.patient?.personne?.civilite, 
                                   "PRATICIEN_SPECIALITE":globalObject?.ps?.specialitesPS?.map((item) => item?.nomSpecialite).join(', '),
                                   "PATIENT": props?.patient?.personne?.nom+" "+props?.patient?.personne?.prenoms,
                                   "PRATICIEN": globalObject?.ps?.titreAcademique+" "+globalObject?.personne?.prenoms+" "+ globalObject?.personne?.nom,
                                   "DATE_DU_JOUR": Utils.formatDate(Utils.currentDate()),

                                };
                                let html={}
                                html.header=globalObject?.clinique?.config?.configEditique?.header
                                let body={}                    
                                body.title=`<div style='font-size: 16px;'>  <br/> ${obj.titre}</div> `
                                body.content="<div class='editable' style='border:0px; word-wrap: break-word; text-align: justify; '>"+ Utils.autoCorrection(e.description,correction)+"</div>"
                                body.footerRight=`<div style='font-size: 12px;'>  <br/>                             
                                    ${globalObject?.clinique?.ville!=null?globalObject?.clinique?.ville?.nomVille:""} le ${Utils.formatDate(Utils.currentDate())} <br/>                        
                                </div> `
                                html.body=Utils.formatHtmlBody(body)
                                html.footer=globalObject?.clinique?.config?.configEditique?.footer
                                obj.contenu=Utils.formatHtml(html,"docCertificat")
                              
                              //console.log("e.description",obj.contenu)
                              
                             
                            }
                          else
                             {
                              obj.titre=""
                              obj.typeModele=""
                              obj.contenu=""
                              
                            }
 
                           setDocumentModele(obj)
                           setExisteDateDebut(false)
                           setExisteDateFin(false)
                           obj.dateDebut=""
                            obj.dateFin=""
                        }}
                        options={modeles}
                        placeholder={'Type de correspondance'}
                        className={`${errors.typeModele.length>0 ? 'is-invalid' : ''}`}
						menuPortalTarget={document.body}
                        menuPosition={'fixed'} 
                        styles={{
                          ///.....
                          menuPortal: provided => ({ ...provided, zIndex: 9999 }),
                          menu: provided => ({ ...provided, zIndex: 9999 })
                          ///.....
                        }}
                        />
                       <div className="invalid-feedback">{errors.typeModele}</div>
                    </div>
                     
                  {/*   <div className="form-group">             
                      <input
                      disabled ={true}
                        type="text"                       
                        id="titre"
                        required
                        value={documentModele.titre}
                        onChange={handleDocumentModeleChange}
                        name="titre"
                        placeholder="Titre du document"
                        maxLength="250"
                        className={`form-control form-control-sm ${errors.titre.length>0 ? 'is-invalid' : ''}`}
                      />
                       <div className="invalid-feedback">{errors.titre}</div>
                    </div>*/}
                      <div className="row">
                       <div className="col-md">   
                    {((documentModele.contenu.includes("DATE_DEBUT")||existeDateDebut)&&(
                     <div className="form-group">                   
                     <input
                        id="dateDebut"
                        label="Date de debut"
                        type="date"                    
                        //defaultValue="2017-05-24"                       
                        name="dateDebut"
                        value={documentModele.dateDebut}
                        onChange={(event) => {
                              const { name, value } = event.target;
                              let obj={...documentModele}                     
                              obj.dateDebut=value
                              const correction = 
                                { 
                                   "DATE_DEBUT": Utils.formatDate(value),
                                };

                                obj.contenu=Utils.autoCorrection(documentModele.contenu,correction)
                                setDocumentModele(obj)
                                setExisteDateDebut(true)
                            }
                          }
                        
                        className={`form-control form-control-lg ${errors.dateDebut.length>0 ? 'is-invalid' : ''}`}
                      />
                      <div className="invalid-feedback">{errors.dateDebut}</div>
                    </div>))} 
                    </div>
                       <div className="col-md">   
                      {((documentModele.contenu.includes("DATE_FIN")||existeDateFin)&&(
                     <div className="form-group">                   
                     <input
                        id="dateFin"
                        label="Date de fin"
                        type="date"                    
                        //defaultValue="2017-05-24"                       
                        name="dateFin"
                        value={documentModele.dateFin}
                        onChange={(event) => {
                              const { name, value } = event.target;
                              let obj={...documentModele}                     
                              obj.dateFin=value
                              const correction = 
                                { 
                                   "DATE_FIN": Utils.formatDate(value),
                                };

                                obj.contenu=Utils.autoCorrection(documentModele.contenu,correction)
                                setDocumentModele(obj)
                                 setExisteDateFin(true)
                            }
                          }
                       
                        className={`form-control form-control-lg ${errors.dateFin.length>0 ? 'is-invalid' : ''}`}
                      />
                      <div className="invalid-feedback">{errors.dateFin}</div>
                    </div>))}
                    </div>
                   </div>
                 
                    {documentModele?.contenu?.length>0&&(
                    <div className="form-group">
                    <label>Contenu </label>
                     <Editor
                      apiKey="" // Remplacez par une clé API valide ou laissez vide pour le mode gratuit
                      value={documentModele?.contenu}
                      tinymceScriptSrc="/js/tinymce/tinymce.min.js" // Remplacez par le chemin vers tinymce.min.js
                      init={Utils.initEditorEditable}
                      onEditorChange={(newValue, editor) => {
                        //editor.getContent({ format: "text" }))
                        setDocumentModele({...documentModele,"contenu":newValue})
                        }}
                        />
                     </div>)}

                    
                   
                    <div className="form-group">             
                      <textarea
                        type="text"                       
                        id="remarque"
                        required
                        value={documentModele.remarque}
                        onChange={handleDocumentModeleChange}
                        name="remarque"
                        placeholder="Remarque"
                        maxLength="250"
                        className={`form-control form-control-sm`}
                      />
                       
                       
                    </div>
                   {/* <div className="form-group" >  
                    
                     <label> Fichiers</label> 
                     <div className="text-danger">{errors.remarque}</div>
                        {<LoadFiles showImage={false} label={"selectedFiles"} multiFile={true} action={perform.action} selectedFiles={selectedFiles} handleLoadFiles={handleLoadFiles}/>}                     
                    </div>*/}
                    {(showAllDocumentModeles==true)&&(
                     <div className="form-group">                        
                    <select id="actif" name="actif" onChange={handleDocumentModeleChange} value={documentModele.actif}  className={`form-control form-control-sm ${errors.actif.length>0 ? 'is-invalid' : ''}`}>
                      <option disabled={true} value="">Actif</option>
                      <option value={true}>Oui</option>
                      <option value={false}>Non</option>                      
                   </select>        
                      <div className="invalid-feedback">{errors.actif}</div>
                    </div>)}                      
                </div>               
              </div>
  )}
const renderShowDocumentModele=() =>{
   let fileName=(documentModele.titre+"_"+props.patient.personne.nom+'_'+props.patient.personne.prenoms+'_'+Utils.currentDateTime().replaceAll(":",'_')).replaceAll(" ",'_')
htmlTemplate.header=globalObject?.clinique?.config?.configEditique?.header

  htmlTemplate.footer=globalObject?.clinique?.config?.configEditique?.footer
  htmlTemplate.body=documentModele?.contenu
  console.log("htmlTemplate.body=====>",htmlTemplate.body)
return (

 <div className="row">
                <div className="col-md">  

                  <div>
                     <table className='table table-bordered table-sm' >
                <tbody>
                    <tr><th className="table-active">Type de correspondance</th><td>{documentModele.typeModele}</td></tr>
                    <tr><th className="table-active">Titre</th><td>{documentModele.titre}</td></tr>
                      <tr><th className="table-active">Crée par</th><td>{(personnel!=null&&personnel?.personne!=null) ?(personnel?.titreAcademique +" "+personnel?.personne?.nom+" "+personnel?.personne.prenoms):""}</td></tr> 

                    <tr ><th colSpan="2" className="table-active">Libellé</th> {/*<td >
                   <div  style={{ "overflow": "auto", "maxHeight": "400px",  "maxWidth": "400px"}} dangerouslySetInnerHTML={Utils.createMarkup(documentModele.contenu)}/>
                    </td>*/}
                    </tr>
                     <tr><td colSpan="2">
                     {perform?.action=="PRINT"?(
                      <PdfRender renderAs="PdfViewer" save={true} fileName={fileName} keywords='Certificat, Lettre' key={Utils.uuidv4()} htmlTemplate={htmlTemplate} 
                      format={globalObject?.clinique?.config?.configEditique?.certificatFormat} orientation={globalObject?.clinique?.config?.configEditique?.certificatOrientation}
                      maxSizeMB={globalObject?.clinique?.config?.configEditique?.imgMaxSizeMB} footerFixed={true} />):(
                       <Editor
                      apiKey="" // Remplacez par une clé API valide ou laissez vide pour le mode gratuit
                      value={documentModele?.contenu}
                      tinymceScriptSrc="/js/tinymce/tinymce.min.js" // Remplacez par le chemin vers tinymce.min.js
                      init={Utils.initEditorNonEditable}
                     
                        />

                        )}

                     </td></tr>
                   
                     {(showAllDocumentModeles==true)&&(
                      <tr><th className="table-active">Actif</th><td>{documentModele.actif==true? "Oui":"Non"}</td></tr>
                      )} 
                    <tr><th colSpan="2" className="table-active">Remarque :</th></tr>
                    <tr><td colSpan="2">{documentModele.remarque}</td></tr> 
                    <tr><th className="table-active">Modifié le</th><td>{documentModele.dateModif}</td></tr>
                   {(permission?.action?.includes("CRUD"))&&( 
                    <tr><th className="table-active">Modifié par</th><td>{documentModele.userId}</td></tr>)} 
                                                      
                </tbody>
              </table>
                   
                     
                    {selectedFiles.length>0 &&(           
                       <div className="form-group for" >  
                     <label> DocumentModeles</label> 
                        {<LoadFiles showImage={true} label={"selectedFiles"} multiFile={true} action={perform.action} selectedFiles={selectedFiles} handleLoadFiles={handleLoadFiles}/>}
                    </div>   
                    )}                                                           
                  </div>         
                </div>
              </div>
  )}


const generateCertificatPdf=() =>{

  let fileName=(documentModele.titre+"_"+props.patient.personne.nom+'_'+props.patient.personne.prenoms+'_'+Utils.currentDateTime().replaceAll(":",'_')).replaceAll(" ",'_')
  console.log("imprimer")
  /* htmlTemplate.file={}
   htmlTemplate.file.fileName=fileName
   htmlTemplate.file.format=globalObject?.clinique?.config?.configEditique?.certificatFormat
   htmlTemplate.file.orientation=globalObject?.clinique?.config?.configEditique?.certificatOrientation
   htmlTemplate.file.info={
        title: documentModele.titre,
        author: globalObject?.personnel?.personne?.nom +" "+globalObject?.personnel?.personne?.prenoms,
        subject: 'Certificat/Lettre',
        keywords: 'Certificat, lettre',
        creator:globalObject?.personnel?.personne?.nom +" "+globalObject?.personnel?.personne?.prenoms,
        producer:globalObject?.clinique?.nomEntreprise,
      }
    htmlTemplate.content=documentModele?.contenu
  Utils.fromHtmlToPdf(htmlTemplate)*/



 htmlTemplate.header=globalObject?.clinique?.config?.configEditique?.header

  htmlTemplate.footer=globalObject?.clinique?.config?.configEditique?.footer
  htmlTemplate.body=documentModele?.contenu

// let fileName=('Ordonnance_'+props.patient.personne.nom+'_'+props.patient.personne.prenoms+'_'+Utils.currentDateTime().replaceAll(":",'_')).replaceAll(" ",'_')

return (
   
    <PdfRender renderAs="PdfViewer" save={true} fileName={fileName} keywords='Certificat, Lettre' key={Utils.uuidv4()} htmlTemplate={htmlTemplate} 
    format={globalObject?.clinique?.config?.configEditique?.certificatFormat} orientation={globalObject?.clinique?.config?.configEditique?.certificatOrientation}
    maxSizeMB={globalObject?.clinique?.config?.configEditique?.imgMaxSizeMB} footerFixed={true} />
 
)}


const renderListDocumentModele=() =>{
return (
 <div className="table-responsive">         
      <table id="tListOfdocumentModele" className="table table-striped table-bordered display compact" >
          <thead>
            <tr>
             <th>Date de Modif</th>  
            <th>Date de création</th> 
                <th>Catégorie</th>
                <th>Titre</th>                           
               {(showAllDocumentModeles==true)&&(
               <th>Actif</th> )}            
               <th>Actions</th>             
            </tr>
          </thead>
          <tbody>
           {documentModeles &&
            documentModeles.map((obj, index) => (
                <tr key={index}>   
                <td>{obj.dateModif}</td> 
                <td>{obj.dateRealisation}</td>
                  <td>{obj.typeModele}</td>  
                  <td>{obj.titre}</td>            
                    {(showAllDocumentModeles==true)&&(<td>{obj.actif==true? "Oui":"Non"}</td>)}   
                  <td>
                      <Button variant="info" className="btn-sm"  title="Voir le détail"  onClick={() => performAction(obj, "GET",false)}>
                     <i className="fa fa-eye"></i>
                     </Button>
                     {permission?.action?.includes("U")&&( 
                      <Button  variant="warning" className="btn-sm"  title="Modifier" onClick={() => performAction(obj,"PUT",false)}>
                        <i className="fa fa-edit fa-sm"></i>
                        </Button>)}

                       {permission?.action?.includes("CRUD")&&(  
                       <Button  variant="danger" className="btn-sm"  title="Supprimer" onClick={() => performAction(obj,"DELETE")}>
                        <i className="fa fa-trash fa-sm"></i>
                        </Button>)}
                   </td>              
                </tr>

          ))}          
          </tbody>          
        </table>     
        </div>

)}


return (
<div className="container">        
{/************************************Modal for add documentModele*******************************/}
{loading()}
<div className="submit-form">
    
    <div className="text-right">    <br/> 
       <div className="custom-control custom-checkbox custom-control-inline">
        <input type="checkbox" className="custom-control-input" id="afficherTousDocumentModele" defaultChecked={showAllDocumentModeles}  
        onChange={handleActifdocumentModeleChange}/>
        <label className="custom-control-label" htmlFor="afficherTousDocumentModele">Afficher Tous</label>
      
    
       
    <Button  variant="info" className="btn-sm" 
        title="Rafraichir" onClick={() => retrieveDocumentModeles()}>
        <i className="fa fa-refresh"></i>
     </Button>
      {(permission?.action.includes("C")) && 
       (
     <Button  variant="success" className="btn-sm"  title="Nouveau certificat" onClick={() => performAction(documentModele, "POST")}>
         <i className="fa fa-envelope fa-sm"></i>
     </Button>
          )} 
    </div>
    </div>
      <Modal  centered show={showDocumentModeleModal} onHide={()=>handleCloseDocumentModeleModal} animation={false}  dialogClassName={`${(showPdf?'modal-40vw':'modal-50vw')}`}>
       <Modal.Header >
          <Modal.Title>
          {perform.action=="POST"?("Nouveau document"): 
          (perform.action=="GET"||perform.action=="PRINT")?("Détail sur le document"):
          (perform.action=="PUT")?("Modifier le document " ):
          (perform.action=="DELETE")?("Supprimer le document" ):

         ""} </Modal.Title>
        </Modal.Header>
        <Modal.Body >
            {(perform.action=="PRINT")?(
              generateCertificatPdf()):  (perform.action=="POST" || perform.action=="PUT")? (
            renderFormDocumentModele()
            ):(perform.action=="GET" || perform.action=="DELETE")?(
              renderShowDocumentModele()
              ):""}
        </Modal.Body>
        <Modal.Footer>
        {(perform.action!="PRINT"&&documentModele?.contenu?.length>0)&&(
        <Button variant="success" onClick={() =>{
            if(perform.action!="GET") 
              saveDocumentModele(documentModele,true)
             performAction(documentModele,"PRINT")
           }
          }>Imprimer
          </Button>)}
          {(documentModele.documentModeleId!=null && perform.action=="GET"&& showPdf!=true)?
          <Button variant="warning" onClick={() => performAction(documentModele,"PUT")}>
            Modifier
          </Button>:(perform.action=="POST" && perform.result==""&& showPdf!=true)?(
          <Button variant="success"  onClick={() => saveDocumentModele(documentModele)}>
              Enregister
            </Button>
          ):(perform.action=="PUT" && perform.result==""&& showPdf!=true)?(
            <Button variant="warning"  onClick={() => saveDocumentModele(documentModele)}>
            Mettre à Jour
          </Button>):(perform.action=="DELETE" && perform.result=="")?(
             <Button variant="danger" onClick={() => deleteDocumentModele(documentModele)}>
            Supprimer
          </Button>
          ):""
        }
        {

          <Button variant="secondary" onClick={handleCloseDocumentModeleModal}>
            Fermer
          </Button>
        }
        </Modal.Footer>
      </Modal>
    
    </div>

{/************************************table list*******************************/}
   {renderListDocumentModele()}
 
  </div>
  );
};
let showAllDocumentModeles=false;
let input={
  "patientId":null,
  "emeteurId":null,
  "patientIdInfo":null
};
let htmlTemplate={}
export default DocumentModeles;