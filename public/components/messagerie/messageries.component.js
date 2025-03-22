import React, {useState, useEffect, useCallback } from "react";
import MessagesDataService from "../../services/messagerie/messages.service";
import Utils from "../../utils/utils";
import FileService from "../../services/file.service";
import LoadFiles from "../../components/loadFiles.component";
import { Button,  Modal } from 'react-bootstrap';
import PersonnelsDataService from "../../services/personnels.service";
import globalObject from '../../global.js'
import Select from 'react-select';
import Multiselect from 'multiselect-react-dropdown';
import 'date-fns';
import { TextField } from '@mui/material';
import PdfManager from "../../components/pdf/PdfManager.component";
import $ from 'jquery'; 
/**********autocomplete**********/
import Autocomplete from '@mui/lab/Autocomplete';
import { Editor } from "@tinymce/tinymce-react";
 /* eslint-disable */
const Messages = (props) => {

/*Create message code*/
const initialMessageState = 
    { 
       "messageParentId": null,
       "messageId": null,
        "typeMessage": props?.typeMessage,
        "personnelId": globalObject?.personnel?.personnelId,
        "emeteurId": globalObject?.personne?.personneId,
        "message": "",
        "titre": "",
        "emeteur": globalObject?.personne?.nom+ " "+globalObject?.personne?.prenoms,
        "civilite":globalObject?.personne?.civilite, 
        "dateDelete":"", 
        "pieceJointes": [],
        "destinataires": [],
        "emailDestinataires": "",
         "cc": "",
         "bcc": "",
        "htmlContent":"",
        "delete": false,
        "dateCreation": null,
        "userId": null,
        "remarque":"",

    };
const initialDestinataireState = 
    { 
      
       "messageId": null,  
        "destinataireId": null,
        "destinataire":"",
        "civilite":null, 
        "dateDelete":"", 
        "modeRecpetion": 0,
        "externe": false,
        "delete": false,
        "lu": false,
        "dateLecture": null,
       
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
const [message, setMessage] = useState(initialMessageState);
const [messages, setMessages] = useState([]);
const [perform, setPerform] = useState(initialPerformState);
const [errors, setErrors] = useState(initialMessageState);
const [showMessageModal, setShowMessageModal] = useState(false);
const [selectedFiles, setSelectedFiles] = useState([]);
const [showLoading, setShowLoading] = useState(false);
const [personnels, setPersonnels] = useState([]);

const [showPdf, setShowPdf] = useState(false);
const [copieCarbone, setCopieCarbone] = useState(false);
const  permissionAction=Utils.trouverObjetDansListObject(globalObject?.permissions,"ressource","MESSAGERIE/BOITE_ENVOI")?.action+" "+Utils.trouverObjetDansListObject(globalObject?.permissions,"ressource","MESSAGERIE/BOITE_RECEPTION")?.action;

   useEffect(() => {
   console.log("Mesagerie===========permissionAction",permissionAction)
  
    input.personnelId=globalObject?.personnel?.personnelId
    input.personneId=globalObject?.personne?.personneId
    retrieveMessages();
    retrievePersonnels();
     
  }, []);

const handleCloseMessageModal = () => {
  setShowMessageModal(false);
  let perf=perform;
  perf.result="";  
  setPerform(perf);
  setShowPdf(false)

}
const handleCloseAndReloadMessage = () => {
setShowMessageModal(false);
setErrors(initialMessageState);
retrieveMessages();
}

function showNotif(perf)
{
 Utils.createNotification(perf.result,"Message", perf.msg);                         
handleCloseAndReloadMessage()
}
const handleActifmessageChange = (event) => {
  //let act=event.target.checked;
  showAllMessages=event.target.checked;
  retrieveMessages();
}



//const today=new Date();
const handleMessageChange = event => {
  const { name, value } = event.target;
  setMessage({ ...message, [name]: value });
};




const handleLoadFiles  = useCallback((label, returnedFiles) =>{
//console.log("returnedFiles",returnedFiles);
setSelectedFiles(returnedFiles)

},[selectedFiles]);



async function retrievePersonnels (){
    let  query=`actif=true&personne=true`;   
    

    let resp= await PersonnelsDataService.getByPersonnelsLiteAsync(query); 
          
    if(resp!=null && resp.status=="200" )          
        {
          
          setPersonnels(resp.data)
          console.log("retrievePersonnels",resp.data)
        
        }else 
        {         
           setPersonnels([])
                 
        }
}
async function retrieveMessages (){

  if ($.fn.dataTable.isDataTable(`#tListOfmessage-${props.origine}`)) {
        $(`#tListOfmessage-${props.origine}`).DataTable().destroy();
       
    }
    
      
      let resp=null;
      let query="";
    
      if(props.origine=="Envoi")  
           query=`?emeteurId=${input.personneId}&deleteByEmeteur=false`;
      else
        query=`?destinataireId=${input.personneId}&deleteByDestinataire=false`;
          
    
      resp= await MessagesDataService.findAsync(query);  
      if(resp!=null && resp.status=="200" )          
          {
            setMessages(resp.data);
            console.log("setMessages",resp.data)
            
          }else 
           setMessages([])
          

setTimeout(()=>{ 
    //$('#tListOfmessage').DataTable().destroy();                       
    $(`#tListOfmessage-${props.origine}`).DataTable(

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

async function saveMessage (message)  {
 const obj = {...message};
   //setMessage(obj);
   obj.emailDestinataires=obj.emailDestinataires.replace(/\s/g,'')

   obj.userId=globalObject?.user?.id
   var perf=perform;
     if(isValid(obj))
     {       
     if(obj.emailDestinataires.length>0)
      {
        obj.htmlContent=Utils.createMarkup(obj.message).__html

        console.log("----------------------",obj.htmlContent)
      }
    


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
                    let listFileinfo= await FileService.createMulipleFilesAsync(newFiles, obj.typeMessage,`Personne concernée :${obj.personnelId} \n  Nom et prenoms: ${obj.personnelIdInfo} \n libellé du message: ${obj.message}`);     
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
            let list=[]
             for( const destinataire of obj.destinataires)
            {
              let dest={...initialDestinataireState}
              dest.destinataireId=destinataire.label
              dest.destinataire=destinataire.value
              list.push(dest)
            }
            obj.destinataires=list
            let response="";
            if(obj.messageId!=null && obj.messageId!="")
              response= await MessagesDataService.updateAsync(obj.messageId,obj);
            else
              response= await MessagesDataService.createAsync(obj);
            
           
            if(response!=null && (response.status=="200" || response.status=="201"))
              {
                //vac=person.data;
                setMessage(response.data);             
                perf.result="success";
                if(perf.action=="POST")
                  perf.msg="Message envoyé" 
                else
                  perf.msg="Mise à jour effectuée avec succès" 
                 showNotif(perf);  

                
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

async function deleteMessage(obj) {
  obj.userId=globalObject?.user?.id
  if(obj.messageId!=null && obj.messageId!="")
  {
      obj.delete=true;
    let perf=perform;
    let response=await MessagesDataService.updateAsync(obj.messageId,obj);
    if(response!=null && response.status=="200")
      {
          //setMessage(response.data);             
          perf.result="success";
          //perf.msg="Suppression effectué avec succès"  
      } 
        else
        {
           
              perf.result="error";
              perf.msg= response.data.message;
              
        }
        if(perform.action=="DELETE")
        {  
          perf.msg="Message supprimé"  
         showNotif(perf);   
        }
        else 
          retrieveMessages();    
      
        //props.handleToUpdatePatient();
    }
  };


async function updateDestinataire(messageId, destinataire) {
  if(messageId!=null && messageId!=""  && destinataire.id!=null && destinataire.id!=""&&destinataire.destinataireId!=null && destinataire.destinataireId!="")
  {
      if(perform.action=="DELETE")
        destinataire.delete=true
      let perf=perform;
    let response=await MessagesDataService.updateDestinataireAsync(messageId,destinataire);
    if(response!=null && response.status=="200")
      {
          //setMessage(response.data);             
          perf.result="success";
          
                                      
      } 
        else
        {
           
              perf.result="error";
              perf.msg= response.data.message;
              
        }
        if(perform.action=="DELETE")
        {  
          perf.msg="Message supprimé"  
         showNotif(perf);   
        }
        else 
          {

            retrieveMessages(); 

            } 
            props.handleNewMessage()
        //props.handleToUpdatePatient();
    }
  };

function isValid  (obj) {
 
    let err=initialMessageState;
    let valid=true;
    //  console.log("message",obj); 
      
    
      if( obj.titre==null || obj.titre.length<2) 
       {
         err.titre="Titre incorrecte";
         valid=false;
     } 
   if( obj.message==null || obj.message.length<2) 
       {
         err.message="Saisir le contenu du message";
         valid=false;
     } 
    if( (obj.destinataires==null||obj.destinataires.length==0) && (obj.emailDestinataires==null|| obj.emailDestinataires.length==0)) 
      {
         err.remarque="Au moins un destinataire est requis";
         valid=false;
     }else 
       {
        if( obj.emailDestinataires!=null && obj.emailDestinataires.length>0) 
        {
           let fields = obj.emailDestinataires.trim().split(';');
           let correct=true
           for( const field of fields)
           {
            if(!Utils.validateEmail(field))            
              correct=false
           
           }
            if( correct==false) 
            {
             err.emailDestinataires="Format d'Email incorrecte";
             valid=false;
           }
       } 
      }

      if( obj.cc!=null &&obj.cc.length>0) 
        {
           let fields = obj.cc.trim().split(';');
           let correctCc=true
           for( const field of fields)
           {
            if(!Utils.validateEmail(field))            
              correctCc=false
           
           }
            if( correctCc==false) 
            {
             err.cc="Format d'Email incorrecte";
             valid=false;
           }
        }

        if(obj.bcc!=null && obj.bcc.length>0) 
        {
           let fields = obj.bcc.trim().split(';');
           let correctBcc=true
           for( const field of fields)
           {
            console.log(">>>>>>>>>>>>field",field)
            if(!Utils.validateEmail(field))            
              correctBcc=false      
           }
            if(correctBcc==false) 
            {
             err.bcc="Format d'Email incorrecte";
             valid=false;
           }
        }
      
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

  if(action=="POST" ||action=="PUT")
  {
    if(action=="POST")
    {
      setMessage(initialMessageState);
      setCopieCarbone(false)
    }else
    {
      let msg={...initialMessageState}
      let destinataires=[]
      // let destinataires= obj.destinataires.filter(item => item.destinataireId ==input.personneId);
      for(let item of obj.destinataires)
      {
        if(item.destinataireId !=input.personneId)
         {
          console.log("new destinataire======>",item)
          let dest={}
          dest.label=item.destinataireId
          dest.value=item.destinataire
          destinataires.push(dest)
         }
      }
      let dest={}
      dest.label=obj.emeteurId
      dest.value=obj.emeteur
      destinataires.push(dest)
      msg.destinataires=destinataires
      msg.messageParentId=obj.messageId
      msg.titre="Re:"+obj.titre
      msg.emailDestinataires=obj.emailDestinataires
      msg.message=obj.message
      msg.cc=obj.Cc
      msg.bcc=obj.bcc
     
      action="POST"
      console.log("new msg======>",msg)
      setMessage(msg)
    }

    setSelectedFiles([]);
    

    perf=initialPerformState;
    perf.action=action;   
    //updatePerform(perf);
  }else
  {
     if(action=="GET"&& props.origine=="Reception")
    {

     let dest=obj.destinataires.find(item => item.destinataireId ==input.personneId)
      console.log("destinataire==>",dest)
     if(dest!=null && dest.lu==false)
      {
        dest.lu=true
        updateDestinataire(obj.messageId,dest)
      } 

    }


     if(obj.pieceJointes.length>0)
      {

        let listOfFileId=[]
        for(const file of selectedFiles)
        {
           listOfFileId.push(file.id)
        }
        //console.log("listOfFileId", listOfFileId)
        //console.log("message.pieceJointes", message.pieceJointes)
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
    handleCloseMessageModal();
    setMessage(obj);        
    /*handleShowMessageModal();
    
    updatePerform(perf);*/
    }
    setErrors(initialMessageState);
    updatePerform(perf);
    
    
  };

function updatePerform  (perf) {
  setPerform(perf);
  setShowMessageModal(false);
  setShowMessageModal(true);
}

const handleCloseLoading = () => {
  setShowLoading(true);
}
function shortMsg  (msg, maxLength) {
 if(msg!=null && msg.length>=maxLength+3)
  msg=msg.slice(0,maxLength)+"..."
return msg
}

function getDestinataire  (msg) {
  let dest
  dest=msg.destinataires.find(item => item.destinataireId ==input.personneId)
 return dest

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
const renderFormMessage=() =>{
  //console.log("selectedFiles",selectedFiles)
return (

  <div className="row">
                 <div className="form-group ">
                   <Multiselect
                      options={personnels} // Options to display in the dropdown
                      selectedValues={message.destinataires} // Preselected value to persist in dropdown
                      onSelect= {(selectedList, selectedItem)=> {
                        
                        setMessage({ ...message, "destinataires": selectedList });
                       }} // Function will trigger on select event
                      onRemove={(selectedList, removedItem)=> {
                        
                         setMessage({ ...message, "destinataires": selectedList });
                       }} // Function will trigger on remove event
                      displayValue="value" // Property name to display in the dropdown options
                      //groupBy="categoriePS.nomCategorie"
                       showCheckbox={true}
                       name="destinataires"
                       isObject={true}
                       selectionLimit={100}
                      placeholder="A (Interne):" 
                      className={`${errors.remarque.length>0 ? 'is-invalid' : ''}`}
                      />                             
                         <div className="text-danger">{errors?.remarque.length>0&& errors?.remarque}</div>
                         
                      </div>
                     <div className="form-group">             
                      <input        
                        type="text"                       
                        id="emailDestinataires"
                        required
                        value={message.emailDestinataires}
                        onChange={handleMessageChange}
                        name="emailDestinataires"
                        placeholder="A (Externe-Emails séparés par des ; si plusieurs destinataires):"
                        maxLength="250"
                        className={`form-control form-control-sm ${errors.emailDestinataires.length>0 ? 'is-invalid' : ''}`}
                      />
                       <div className="invalid-feedback">{errors.emailDestinataires}</div>
                    </div>
                    {copieCarbone==false&&(
                    <a href="#" onClick={() =>setCopieCarbone(true)}>Cc/Cci</a>
                    )}
                     {copieCarbone==true&&(
                    <div className="form-group">             
                      <input        
                        type="text"                       
                        id="cc"
                        required
                        value={message.cc}
                        onChange={handleMessageChange}
                        name="cc"
                        placeholder="Cc:"
                        maxLength="250"
                        className={`form-control form-control-sm ${errors.cc.length>0 ? 'is-invalid' : ''}`}
                      />
                       <div className="invalid-feedback">{errors.cc}</div>
                    </div>)}
                    {copieCarbone==true&&(
                     <div className="form-group">             
                      <input        
                        type="text"                       
                        id="bcc"
                        required
                        value={message.bcc}
                        onChange={handleMessageChange}
                        name="bcc"
                        placeholder="Cci:"
                        maxLength="250"
                        className={`form-control form-control-sm ${errors.bcc.length>0 ? 'is-invalid' : ''}`}
                      />
                       <div className="invalid-feedback">{errors.bcc}</div>
                    </div>)}
                <div className="form-group">             
                      <input        
                        type="text"                       
                        id="titre"
                        required
                        value={message.titre}
                        onChange={handleMessageChange}
                        name="titre"
                        placeholder="Object du message"
                        maxLength="250"
                        className={`form-control form-control-sm ${errors.titre.length>0 ? 'is-invalid' : ''}`}
                      />
                       <div className="invalid-feedback">{errors.titre}</div>
                    </div>
                <div className="form-group">
                    <label>Message </label>
                       <Editor
                      apiKey="" // Remplacez par une clé API valide ou laissez vide pour le mode gratuit
                      value={message?.message}
                      tinymceScriptSrc="/js/tinymce/tinymce.min.js" // Remplacez par le chemin vers tinymce.min.js
                      init={Utils.initEditorLite}
                      onEditorChange={(newValue, editor) => {
                        //editor.getContent({ format: "text" }))
                        setMessage({...message,"message":newValue})
                        }}
                        />

                      <div className="text-danger">{errors.message}</div>
                  </div>
                  <div className="form-group" >       
                     <label> Fichiers</label> 
                     <div className="text-danger">{errors.destinataires}</div>
                        {<LoadFiles showImage={false} label={"selectedFiles"} multiFile={true} action={perform.action} selectedFiles={selectedFiles} handleLoadFiles={handleLoadFiles}/>}                     
                    </div>
                                         
                           
              </div>
  )}
const renderShowMessage=() =>{
  console.log("selectedFiles",selectedFiles)
return (

 <div className="row">
                <div className="col-md">  

                  <div>
                     <table className='table  table-sm ' >
                <tbody>
                    <tr><td><p className="text-start"><b>Par:</b>{message.emeteur}</p></td><td><p className="text-end" >{message.dateCreation}</p></td></tr>
                    <tr><td colSpan="2"><b>Object: </b>{message.titre}</td></tr>
                    <tr><td colSpan="2"><b>A (Interne): </b>{message.destinataires.map((item) => item?.destinataire).join('; ')}</td></tr>
                    {message.emailDestinataires!=null && message.emailDestinataires!=""&&(<tr><td colSpan="2"><b>A (Externe): </b>{message.emailDestinataires}</td></tr>)}
                    {message.cc!=null && message.cc!=""&&(<tr><td colSpan="2"><b>Cc: </b>{message.cc}</td></tr>)}
                     {message.bcc!=null && message.bcc!=""&&(<tr><td colSpan="2"><b>Cci: </b>{message.bcc}</td></tr>)}

                    <tr className="overflow-auto"><td colSpan="2" className="bg-light"><div dangerouslySetInnerHTML={Utils.createMarkup(message.message)}/></td></tr>
                 </tbody>
              </table>
                         
                    {selectedFiles.length>0 &&(           
                       <div className="form-group for" >  
                     <label> Pièce jointes</label> 
                        {<LoadFiles showImage={true} label={"selectedFiles"} multiFile={true} action={perform.action} selectedFiles={selectedFiles} handleLoadFiles={handleLoadFiles}/>}
                    </div>   
                    )}                                                           
                  </div>         
                </div>
              </div>
  )}


const renderPdfManager=() =>{
return (
 
  
    <PdfManager renderAs="inDOM" key={Utils.uuidv4()} titre={message.titre} content={message.message}/>
 

)}
const renderListMessage=() =>{
return (
 <div className="table-responsive">         
      <table id={`tListOfmessage-${props.origine}`} className="table table-striped table-bordered display compact" >
          <thead >
            <tr>
            <th>Date de Modif</th>  
               <th> {(props.origine=="Envoi")?("Envoyé à"):("Envoyé par")}</th>

               <th>Titre</th>
                <th>Date</th>                                     
               <th>Actions</th>             
            </tr>
          </thead>
          {(props.origine=="Envoi")?(
          <tbody>
           {messages &&
            messages.map((obj, index) => (
                <tr key={index}>   
                <td>{obj.dateCreation}</td>   
                <td><span className="text-secondary" >{obj.destinataires.map((item) => item?.destinataire).join('; ')};{obj.emailDestinataires}</span></td>
                <td><span className="text-secondary" >{shortMsg(obj.titre,25)} {shortMsg(JSON.parse(obj.message)?.blocks.map((item) => item?.text).join(' '),25)}</span></td>
                <td><span className="text-secondary" >{obj.dateCreation.slice(0, -3).replace(" "," à ")}</span></td>
                 
                  <td>
                      <img src="/img/read.png" title="Voir details"  alt="Voir details" className="icone-action"
                      onClick={() => performAction(obj, "GET")}/> 
                     {/* <img src="/img/write.png" title="Modifier"  alt="Modifier" className="icone-action"
                      onClick={() => performAction(obj,"PUT")}/>*/}
                       <img src="/img/delete.png" title="Supprimer"  alt="Supprimer" className="icone-action"
                       onClick={() => performAction(obj,"DELETE")}/>
                   </td>              
                </tr>

          ))}          
          </tbody>):
          (
            <tbody>
           {messages &&
            messages.map((obj, index) => (
                <tr key={index}>   
                <td>{obj.dateCreation}</td>   
                {(getDestinataire(obj)?.lu)?(<td><span className="text-secondary" >{obj.emeteur}</span></td>):(<td><b>{obj.emeteur}</b></td>)}
                 {(getDestinataire(obj)?.lu)?(<td><span className="text-secondary" >{shortMsg(obj.titre,25)} {shortMsg(JSON.parse(obj.message)?.blocks.map((item) => item?.text).join(' '),25)}</span></td>
                  ): (<td><b>{shortMsg(obj.titre,25)}</b><span className="text-secondary" > {shortMsg(JSON.parse(obj.message)?.blocks.map((item) => item?.text).join(' '),25)}</span></td>)}
                  <td><span className="text-secondary" > {obj.dateCreation.slice(0, -3).replace(" "," à ") }</span></td> 
                 
                  <td>
                      <img src="/img/read.png" title="Voir details"  alt="Voir details" className="icone-action"
                      onClick={() => performAction(obj, "GET")}/> 
                     <img src="/img/answer.png" title="Répondre"  alt="Répondre" className="icone-action"
                      onClick={() => performAction(obj,"PUT")}/>
                       <img src="/img/delete.png" title="Supprimer"  alt="Supprimer" className="icone-action"
                       onClick={() => performAction(obj,"DELETE")}/>
                   </td>              
                </tr>

          ))}          
          </tbody>
            )}          
        </table>     
        </div>

)}


return (
<div className="container">        
{/************************************Modal for add message*******************************/}
{loading()}
<div className="submit-form">
    
    <div className="text-right">    
       <div className="custom-control custom-checkbox custom-control-inline">
        {/*<input type="checkbox" className="custom-control-input" id="afficherTousMessage" defaultChecked={showAllMessages}  
        onChange={handleActifmessageChange}/>
        <label className="custom-control-label" htmlFor="afficherTousMessage">Afficher Tous</label>*/}
        <br/>
        <Button  variant="info" className="btn-sm" 
        title="Rafraichir" onClick={() => retrieveMessages()}>
        <i className="fa fa-refresh"></i>
     </Button>

      {  permissionAction?.includes("C") &&(message.personnelId!=null&&message.personnelId!="")&&(  
        <Button  variant="success" className="btn-sm"  title="Nouveau message" onClick={() => performAction(message, "POST")}>
         <i className="fa fa-user-md fa-sm"></i>
        </Button>
      )}

    </div>
    </div>
      <Modal  centered show={showMessageModal} onHide={()=>handleCloseMessageModal} animation={false} dialogClassName={`${(showPdf?'modal-400vw':'modal-50vw')}`}>
       <Modal.Header >
          <Modal.Title>
          {perform.action=="POST"?("Nouveau message"): 
          (perform.action=="GET")?("Détail sur le message"):
          (perform.action=="PUT")?("Répondre au message " ):
          (perform.action=="DELETE")?("Supprimer le message" ):

         ""} </Modal.Title>
        </Modal.Header>
        <Modal.Body className={`${(showPdf?'modal-400vw':'')}`}>
            {showPdf? renderPdfManager()
            : ( (perform.action=="POST" || perform.action=="PUT"))? (
            renderFormMessage()
            ):(perform.action=="GET" || perform.action=="DELETE")?(
              renderShowMessage()
              ):""}
        </Modal.Body>
        <Modal.Footer>
        {/* <Button variant="success" onClick={() =>showPdf?setShowPdf(false):setShowPdf(true)}>
          {showPdf?"Retour":"Imprimer"}
          </Button>*/}
          {(perform.action=="POST" && perform.result==""&& showPdf!=true)?(
          <Button variant="success"  onClick={() => saveMessage(message)}>
              Envoyer
            </Button>
          ):(perform.action=="GET" && perform.result==""&& showPdf!=true)?(
            <Button variant="warning"  onClick={() => performAction(message,"PUT")}>
            Répondre
          </Button>):(perform.action=="DELETE" && perform.result=="")?(
             <Button variant="danger" onClick={() => props.origine=="Envoi"?deleteMessage(message):updateDestinataire(message.messageId,getDestinataire(message))}>
            Supprimer
          </Button>
          ):""
        }
        {

          <Button variant="secondary" onClick={handleCloseMessageModal}>
            Fermer
          </Button>
        }
        </Modal.Footer>
      </Modal>
    
    </div>

{/************************************table list*******************************/}
   {renderListMessage()}
 
  </div>
  );
};
let showAllMessages=false;
let input={
  "personnelId":null,
  "personneId":null
};
export default Messages;