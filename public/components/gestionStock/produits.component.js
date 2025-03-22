import React, {useState, useEffect, useCallback } from "react";
import ProduitsDataService from "../../services/stock/produits.service";
import ModelesDataService from "../../services/modeles.service";
import CategorieProduitsDataService from "../../services/stock/categorieProduits.service";
import FournisseursDataService from "../../services/stock/fournisseurs.service";
import LoadFiles from "../../components/loadFiles.component";
import UploadFile from "../../components/uploadFile.component";
import FileService from "../../services/file.service";
import Utils from "../../utils/utils";
import Styles from '../../styles.module.css';
import { Button,  Modal } from 'react-bootstrap';
import CreatableSelect from 'react-select/creatable';
import Select from 'react-select';
import Multiselect from 'multiselect-react-dropdown';
import globalObject from '../../global.js'
import $ from 'jquery'; 

/********Date management******
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@mui/pickers';*/
import 'date-fns';
import { TextField } from '@mui/material';

/**********autocomplete**********/
import Autocomplete from '@mui/lab/Autocomplete';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
 /* eslint-disable */
const Produits = () => {


const initialApprovisionnementState = 
    { 
       
        "fournisseurId": "",
        "fournisseur": {},
        "prixAchat": "", 
        "conditionnementAchat": "",     
        
    }
/*Create produit code*/
const initialProduitState = 
    { 
       
        "produitId": "",
        "libelle": "",
        "codeProduit": "", 
        "description": "",     
        "fabricant": "",
        "marque": "",
        "modele": "",
        "typeProduit": "",
        "categorieProduit":{},
        "categorieProduitId":"",
        "photos":[],
        "uniteDeMesure": "",
        "prixVente": "",
        "codeBarre": "",
        "tags": "",
        "conditionnementVente": "",
        "soumisALaVente": true,
        "perissable": true,
        "approvisionnement": initialApprovisionnementState,
        "reapprovisionnementAuto": false,
        "poids": "",
        "volume": "",
        "remarque": "",
        "actif": true,
    };


    const initialPerformState = 
     {
        "action": "",
        "result": "",
        "msg": "",      
    };
const [produit, setProduit] = useState(initialProduitState);
const [produits, setProduits] = useState([]);
const [perform, setPerform] = useState(initialPerformState);
const [errors, setErrors] = useState(initialProduitState);
const [show, setShow] = useState(false);
const [categorieProduits, setCategorieProduits] = useState([]);
const [marques, setMarques] = useState([]);
const [modeles, setModeles] = useState([]);
const [fabricants, setFabricants] = useState([]);
const [conditionnements, setConditionnements] = useState([]);
const [tags, setTags] = useState([]);
const [fournisseurs, setFournisseurs] = useState([]);
const [uniteDeMesures, setUniteDeMesures] = useState([]);
const [selectedFiles, setSelectedFiles] = useState([]);
const [loading, setLoading] = useState(false);
const [showLoading, setShowLoading] = useState(false);
const [guid, setGuid] = useState(Utils.uuidv4());

const [query, setQuery] = useState(initialProduitState);
const [errorsQuery, setErrorsQuery] = useState(initialProduitState);

const [upload, setUpload] = useState(null);

 const permission=Utils.trouverObjetDansListObject(globalObject?.permissions,"ressource","STOCK/PRODUIT");
useEffect(() => {
    initQuery()
     retrieveModeles()
     retrieveCategorieProduits();
  }, []);

const handleClose = () => {
  setShow(false);
  let perf=perform;
  perf.result="";  
  setPerform(perf);
}
const handleCloseAndReload = () => {
setShow(false);
refreshProduit()
retrieveProduits(query);
}

function showNotif(perf)
{
 Utils.createNotification(perf.result,"Produit", perf.msg);                         
handleCloseAndReload()
}
const handleQueryChange = event => {
  const { name, value } = event.target;
  setQuery({ ...query, [name]: value });
};

const handleShow = () => setShow(true);

//const today=new Date();
const handleProduitChange = event => {
  const { name, value } = event.target;
  setProduit({ ...produit, [name]: value });
};
const handleLoadFiles  = useCallback((label, returnedFiles) =>{

setSelectedFiles(returnedFiles)

},[selectedFiles]);

  const refreshList = () => {
    retrieveProduits(query);
  };

const refreshProduit = () => {
    setProduit(initialProduitState);
     setErrors(initialProduitState);
     setPerform(initialPerformState);
     //retrieveProduits(query);
  };

async function retrieveModeles (){
    let  query=`?typeModeles=Marque&typeModeles=Modele&typeModeles=Fabricant&typeModeles=Unite&typeModeles=Conditionnement&typeModeles=Tag&actif=true`;   
    

    let resp= await ModelesDataService.findAsync(query); 
          
    if(resp!=null && resp.status=="200" )          
        {
          let elts=[]
          
          let formes=[]
          let voies=[]
         let fabric=[]
         let unites=[]
         let condit=[]
         let listTag=[]
          for(const elt of resp.data)
          {
            let obj={}
            obj.value=elt.nomModele
            obj.label=elt.nomModele
            obj.modeleId=elt.modeleId
          
            if(elt.typeModele=="Marque")
              formes.push(obj)
            else
            if(elt.typeModele=="Modele")
              voies.push(obj)
            else
            if(elt.typeModele=="Fabricant")
              fabric.push(obj)
            else
            if(elt.typeModele=="Unite")
              unites.push(obj)
            else
             if(elt.typeModele=="Conditionnement")
              condit.push(obj)
            else
             if(elt.typeModele=="Tag")
              listTag.push(obj)

          }
         
         setFabricants(fabric)
           setMarques(formes)
           setModeles(voies)
           setUniteDeMesures(unites)
           setConditionnements(condit)
            setTags(listTag)
      
          console.log("retrieveModeles==>",resp.data);
        }else 
        {         
           setMarques([])
           setModeles([])
           setModeles([])
           setUniteDeMesures([])        
        }
}
async function retrieveFournisseurs (act){

  
    let resp=null;
    let query="?"
    
      query+="actif=true"
      resp= await FournisseursDataService.findAsync(query); 
       
    if(resp!=null && resp.status=="200" )          
        {
          
           
          setFournisseurs(resp.data);

          
        }else 
         setFournisseurs([])
}
async function retrieveCategorieProduits (act){

  
    let resp=null;
    let query="?"
    
      query+="actif=true"
      resp= await CategorieProduitsDataService.findAsync(query); 
       
    if(resp!=null && resp.status=="200" )          
        {
          
           let ListCategorieProduitWithLibelleParent=getcategorieProduitWithlibelleParent(resp.data)
          ListCategorieProduitWithLibelleParent=Utils.trierListeParChamp(ListCategorieProduitWithLibelleParent,"libelleParent",true)
          setCategorieProduits(ListCategorieProduitWithLibelleParent);

          
        }else 
         setCategorieProduits([])
}
function getcategorieProduitWithlibelleParent  (empls) {

let list=[]
  for( const catP of empls)
      {
        let obj={...catP}
        let libelleParent=obj.libelle
        let parentId=obj.categorieProduitParentId
        while(parentId!=null &&parentId!="")
        {
          let emplParent=Utils.trouverObjetDansListObject(empls,"categorieProduitId",parentId)
          if(emplParent!=null)
          {
           
            libelleParent=emplParent.libelle+"/"+libelleParent
            parentId=emplParent.categorieProduitParentId
          }else
           parentId=null
        }
        
        obj.libelleParent=libelleParent

        list.push(obj)

      }
      return list
}


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
                      let produit={}
                      produit.id=file.fileId
                      produit.data=`data:${file.fileType};base64,${file.fileData}`
                      //new File([`${file.fileData}`],`${file.fileName}`, {type:`${file.fileType}`}); 
                      //;
                      produit.name=file.fileName                      
                      files.push(produit)
                     }
                     setSelectedFiles(files)
                     setGuid(Utils.uuidv4())
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
//const reload=()=>window.location.reload();
/******************************************/
async function saveProduit (produit)  {
  setLoading(true)
 const obj = {...produit};
  obj.userId=globalObject?.user?.id

  //console.log("saveProduit=========>",obj)

  if(obj.soumisALaVente==false)
  {
    obj.prixVente=0.0
    obj.conditionnementVente=""
  }

  if(obj.fournisseurId=="")
    obj.fournisseurId=null

  if(obj.approvisionnement!=null&&obj.approvisionnement?.fournisseurId==null||obj.approvisionnement?.fournisseurId=="")
    obj.approvisionnement=null
    
  if(obj.categorieProduitId=="")
    {
      obj.categorieProduitId=null
       obj.categorieProduit=null
    }



   var perf=perform;
     if(isValid(obj))
     {       
          
     console.log("saveProduit=========>",obj)
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

            if(obj.photos.length>0 && existFiles.length>0 )
                {
                  let removedFiles = obj.photos.filter(x => !existFiles.includes(x));
                  if(removedFiles.length>0)
                  {
                    let query=""
                    let response=null;
                     for(const fileId of removedFiles)
                        query=query+"&fileId="+fileId
                     
                      response= await FileService.deleteMultileFilesAsync(query);   
                     
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
                 
                    let listFileinfo= await FileService.createMulipleFilesAsync(newFiles, "Produit",`Produit Id: ${obj.produitId} \n Nom produit: ${obj.libelle}`,obj.produitId, obj.userId );     
                 
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
            obj.photos= existFiles;
          let response="";
          if(obj.produitId!=null && obj.produitId!="")
            response= await ProduitsDataService.updateAsync(obj.produitId,obj);
          else
            response= await ProduitsDataService.createAsync(obj);

          if(response!=null && (response.status=="200" || response.status=="201"))
            {
              //obj=person.data;
              setProduit(response.data);             
              perf.result="success";
              if(perf.action=="POST")
                perf.msg="Enregistrement effectué avec succès" 
              else
                perf.msg="Mise à jour effectuée avec succès" 
              
              showNotif(perf); 
                                          
            }  
           else
           {
            
              perf.result="error";
              perf.msg= response.data.message;
             
               showNotif(perf);
               
              
           }
        }            
      }
      setLoading(false) 
  };


  async function handleStatus(obj) {
    obj.userId=globalObject?.user?.id
  if(obj.actif==true)
  {
      obj.actif=false;
   }else 
       obj.actif=true;
  
      let perf=perform;
    let response=await ProduitsDataService.updateAsync(obj.produitId,obj);
    if(response!=null && response.status=="200")
      {
          setProduit(response.data);             
           
          retrieveProduits(query);                               
      } 
        else
        {
           
              perf.result="error";
              perf.msg= response.data.message;
               showNotif(perf);

        }
    
  };

async function initQuery()
{
  let q={...initialProduitState}
    setQuery(q);
    retrieveProduits(q);
}
async function rechercherProduits (){
  if(isValidQuery(query))
    retrieveProduits(query);
}

function isValidQuery (){

   
   let  err=initialProduitState
    let valid=true;
    if((query.libelle!="" && query.libelle.length<3))
    {
          err.libelle="Au moins 3 carractères sont requis"
          valid=false;
       }
      
      setErrorsQuery(err);
      return valid
    
}
async function retrieveProduits (query){

  if ($.fn.dataTable.isDataTable('#tListOfproduit')) {
        $('#tListOfproduit').DataTable().destroy();  
    }
    let q="?"
    if(query.libelle!=null && query.libelle!="")
       q=q+"&libelle="+query.libelle   
     if(query.categorieProduitId!=null && query.categorieProduitId!="")
       q=q+"&categorieProduitId="+query.categorieProduitId   
      if(query.tags!=null && query.tags!="")
       q=q+"&tags="+query.tags          
    if(query.marque!=null && query.marque!="")
       q=q+`&marque=${query.marque}`
     if(query.modele!=null && query.modele!="")
      q=q+"&modele="+query.modele 
    if(query.actif!=null && query.actif!="")
        q=q+"&actif="+query.actif   
    if(globalObject?.config?.defaultPageSize!=null&&Number(globalObject?.config?.defaultPageSize))
      q=q+"&limit="+globalObject?.config?.defaultPageSize
    else
      q=q+"&limit=1000"

    console.log("query=========>",q)
    let resp=null;
    setShowLoading(true)
    resp= await ProduitsDataService.findAsync(q);  
       
    if(resp!=null && resp.status=="200" )          
        {
          setProduits(resp.data);
           console.log("setProduits=========>",resp.data)
          
        }else 
         setProduits([])
      setShowLoading(false)
setTimeout(()=>{ 
    //$('#tListOfproduit').DataTable().destroy();                       
    $('#tListOfproduit').DataTable(

      {
        
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
            // { "width": "20%", "targets": 2 }
        ],
       responsive: true,
        destroy: true,
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
      //init Datatable  




function isValid  (obj) {
 
    let err=initialProduitState;
    let valid=true;
        console.log(obj); 
    if( obj.codeProduit==null || obj.codeProduit.length<2) 
       {
         err.errorMsg+="<br/>-"
       err.errorMsg+=err.codeProduit="Code produit requis";
         valid=false;
     }

     if( obj.libelle==null || obj.libelle.length<2) 
       {
         err.errorMsg+="<br/>-"
       err.errorMsg+=err.libelle="Libellé du produit incorrecte";
         valid=false;
     } 
  
    /*  if( obj.categorieProduitId==null || obj.categorieProduitId.length==0) 
       {
         err.errorMsg+="<br/>-"
       err.errorMsg+=err.categorieProduitId="Indiquer la catégorie du produit";
         valid=false;
     } 
      if( obj.modele==null || obj.modele.length<2) 
       {
         err.modele="Modèle incorrecte";
         valid=false;
     } 
      if( obj.marque==null || obj.marque.length<2) 
       {
         err.marque="Marque incorrecte";
         valid=false;
     }
     
     if(obj.soumisALaVente==true&&(obj.prixVente==null || obj.prixVente=="" ||isNaN(obj.prixVente)) ) 
       {
          err.errorMsg+="<br/>-"
       err.errorMsg+=err.prixVente="Prix de vente incorrecte ";
          valid=false;
     }*/
     if(obj.actif==null || obj.actif.length<2) 
         {
          err.errorMsg+="<br/>-"
       err.errorMsg+=err.actif="indiquer le statut actif oui ou non ";
          valid=false;
     }
 
     if(valid==false)
        {
            err.errorMsg="Une ou plusieurs erreurs ont été constatées dans le formulaire:"+err.errorMsg;
        }
  setErrors(err);
    return valid;

  };


const performAction = (produit,action) => {
  let perf=null;
  if(action=="POST")
  {
    refreshProduit();
    perf=initialPerformState;
     perf.action=action;   
    updatePerform(perf);
    setSelectedFiles([]);

  }else
  {

   if(produit.photos.length>0)
      {

        let listOfFileId=[]
        for(const file of selectedFiles)
        {
           listOfFileId.push(file.id)
        }
        //console.log("listOfFileId", listOfFileId)
        //console.log("produit.photos", produit.photos)
       if(produit.photos.length!=listOfFileId.length || produit.photos.sort().toString()!=listOfFileId.sort().toString())
       {
        setShowLoading(true);
          let query=""
          
         for(const fileId of produit.photos)
           {
            query=query+"&fileId="+fileId
           }   

           
             getListofFiles(query)

          setShowLoading(false);
        }
      }



    perf=perform;
    handleClose();
    setProduit(produit);      
    setErrors(initialProduitState);
    handleShow();
    perf.action=action;
    setPerform(perf);
    }
if(action=="POST"||action=="PUT")
 {
   /*if(modeles.length==0||marques.length==0||fabricants.length==0||uniteDeMesures.length==0||conditionnements.length==0)
    retrieveModeles();*/
  
  if(categorieProduits.length==0)
    retrieveCategorieProduits();
   if(fournisseurs.length==0)
  retrieveFournisseurs()
 } 


    
  };

function updatePerform  (perf) {
  setPerform(perf);
  setShow(false);
  setShow(true);
}


/*************************************upload functionalities****************/

 const uploadFile=(type)=>{
  
 let up={}
 up.type=type;
 up.key=Utils.uuidv4();
 setUpload(up);
 let  perf=perform;
  perf.action="PATCH";
  setPerform(perf);
 }

async function importFile (obj)  {
 
         let response="";
         //console.log(JSON.stringify(obj));
          response= await ProduitsDataService.bulkAsync(obj,globalObject?.user?.id );
         let perf=perform;
          if(response!=null && (response.status=="201"))
            {
               perf.result="success";             
              perf.msg="Import effectué avec succès"             
              showNotif(perf);                 
                                          
            }  
           else
           {
             
              perf.result="error";
              if(response!=null && response.status!=null)
              perf.msg= response.data.message;
              else
                 perf.msg="Une erreur inattendue s'est produite"
             
               showNotif(perf);
               
              
           }            
        
  };

async function returnData (data){
setShowLoading(true)
 let list=fromDataToProduit(data);
 if(list!=null)
   await importFile(list);
 setShowLoading(false)
}


function fromDataToProduit (data){

    //let list=[]
if(data.length>0)
{
    let dataKeys=Object.keys(data[0])
    //console.log("dataKeys==>",dataKeys.join(","))

    //console.log("dataKeysList",dataKeysList)
    const keys=[
"codeProduit","libelle","categorieProduit","fabricant","marque","modele","tags","description","typeProduit","poids","volume","uniteDeMesure","prixVente","codeBarre","conditionnementVente","perissable","soumisALaVente","reapprovisionnementAuto","actif" 
    ]
    //test if all datakeys elt are in keys
    if(dataKeys.every(v => keys.includes(v)))
    {
        // console.log("Structure du fichier CSV incorrecte")

           let list= data.map(elt => (

                {    "produitId": null,
                      "libelle": elt.libelle,
                      "codeProduit": elt.codeProduit, 
                      "categorieProduitId":elt.categorieProduit==""?null:elt.categorieProduit,
                      "categorieProduit":null,
                      "description": elt.description,     
                      "fabricant": elt.fabricant,
                      "marque": elt.marque,
                      "modele": elt.modele,
                      "typeProduit": elt.typeProduit,               
                      "photos":[],
                      "uniteDeMesure": elt.uniteDeMesure,
                      "prixVente": elt.prixVente,
                      "codeBarre": elt.codeBarre,
                      "tags": elt.tags,
                      "conditionnementVente": elt.conditionnementVente,
                      "perissable":Utils.convertToBoolean(elt.perissable),
                      "soumisALaVente": Utils.convertToBoolean(elt.soumisALaVente),
                      "approvisionnement": {},
                      "reapprovisionnementAuto": Utils.convertToBoolean(elt.reapprovisionnementAuto),
                      "poids": elt.poids,
                      "volume": elt.volume,
                      "remarque":  elt.remarque,
                      "actif":  Utils.convertToBoolean(elt.actif)
                     
                }
                 ));
       
        if(list[list.length-1].libelle==undefined)
           {
            list.pop()//remove last element
             //console.log("list[list.length-1].personne.nom",list)
            if(list.length==0)
               { 
                let perf={...perform};
                 perf.result="error";
                 perf.msg="Le fichier selectionné ne contient aucun enregistrement";
                 setPerform(perf);
                  showNotif(perf); 
                return null
            }
           } 

        let i=2;
        for (let elt of list) {
           
            //console.log("elt==>",elt)
            if(!isValid(elt))
            {
                 let perf={...perform};
                 perf.result="error";
                 perf.msg="Erreur à la ligne "+i+" du fichier";
                 setPerform(perf);
                 showNotif(perf); 
                return null
            }
            i++;
            
        }
        console.log("list before return",list)
        return list

    }else{ 
    let perf={...perform};
         perf.result="error";
         perf.msg="Les entêtes du fichier sont incorrectes"+dataKeys;
         setPerform(perf);
         showNotif(perf); 
      return null   
   
    }
  }else{ 
    let perf={...perform};
         perf.result="error";
         perf.msg="Le fichier est vide";
         setPerform(perf);
          showNotif(perf); 
      return null   
    
    }
}



const renderListOfProduit=() =>{
return (
<div className="table-responsive">         
      <table id="tListOfproduit" className="table table-striped table-bordered display compact" >
          <thead>
            <tr>
              <th>Date de Modif</th>
                <th>Code</th>
                <th>Libellé</th>
                  <th>Categorie</th>
                   <th>Marques</th>
                    <th>Modèles</th>
                <th>Actif</th>
                               
               <th>Actions</th>             
            </tr>
          </thead>
          <tbody>
           {produits &&
            produits.map((produit, index) => (
                <tr key={index}> 
                 <td>{produit.dateModif}</td> 
                  <td>{produit.codeProduit}</td>       
                  <td>{produit.libelle}</td> 
                    <td>{produit?.categorieProduit?.libelle}</td>           
                   <td>{produit?.marque}</td>
                  <td>{produit?.modele}</td>

                  <td>{produit.actif==true?"Oui":"Non"}</td> 
                 
                  
                  <td>
                  {/*    <img src="/img/read.png" title="Voir details"  alt="Voir details" className="icone-action"
                      onClick={() => performAction(produit, "GET")}/> 
                      <img src="/img/write.png" title="Modifier"  alt="Modifier" className="icone-action"
                      onClick={() => performAction(produit,"PUT")}/>
                       {(produit.actif==true)?(
                        <img src="/img/on.png" title="Déactiver"  alt="cliquer pour déactiver" className="icone-action-25"
                       onClick={() => handleStatus(produit)}/>
                        ):(
                        <img src="/img/off.png" title="Activer"  alt="cliquer pour activer" className="icone-action-25"
                       onClick={() => handleStatus(produit)}/>
                        )
                    }
            */}

                     <div className="btn-group">
                      <Button variant="info" className="btn-sm"  title="Voir le détail" onClick={() => performAction(produit, "GET")}><i className="fa fa-eye"></i> </Button>
                    {permission?.action?.includes("U")&&
                    <Button  variant="warning" className="btn-sm"  title="Modifier" onClick={() => performAction(produit, "PUT")}><i className="fa fa-edit fa-sm"></i></Button>  
                    }
                    {permission?.action?.includes("U")&&(produit.actif==false? <Button  variant="light" className="btn-sm" 
                              title="Activer" onClick={() => handleStatus(produit)}>
                           <i className="fa fa-toggle-off"></i>
                    </Button>:
                     <Button  variant="light" className="btn-sm" 
                             title="Déactiver" onClick={() => handleStatus(produit)}>
                            <i className="fa fa-toggle-on"></i>
                    </Button>)}   
                      
                     
                     </div>
                   </td>              
                </tr>

          ))}          
          </tbody>          
        </table>     
        </div>
  )}


const renderRechercheProduit=() =>{
return (

<div className="container">
<div className="col-md-6 " >
Rechercher
<div className="row border border-secondary p-2" >

    <div className="col-md-6" >
    
            <div className="form-group">             
                      <input
                        type="text"                       
                        id="libelle"
                        required
                        value={query.libelle}
                        onChange={handleQueryChange}
                        name="libelle"
                        placeholder="Nom du produit"
                        maxLength="100"
                        className={`form-control form-control-sm ${errorsQuery.libelle.length>0 ? 'is-invalid' : ''}`}
                      />
                       <div className="invalid-feedback">{errorsQuery.libelle}</div>
                    </div>
                    <div className="form-group" >     
                    <Select
                        
                       defaultValue={produit?.categorieProduit!=null&&produit?.categorieProduit?.categorieProduitId!=null?produit?.categorieProduit:""}
                       getOptionLabel={e => e.libelle}
                        getOptionValue={e => e.categorieProduitId}
                       isClearable={true}
                       onChange={(newValue) => { 
                            let obj={ ...query}                                             
                              if(newValue!=null)                           
                               {
                                obj.categorieProduitId=newValue.categorieProduitId
                                obj.categorieProduit=newValue
                                                            
                               } 
                                else
                             {
                                    obj.categorieProduitId=initialProduitState.categorieProduitId 
                                    obj.categorieProduit=initialProduitState.categorieProduit
                                }   
                              setQuery(obj);
                              
                              }
                          }
                        noOptionsMessage={() => 'Aucune correspondance'}
                        options={categorieProduits}
                        placeholder={`Categorie de produit`}
                        className={`form-control-sm px-0 ${errorsQuery?.categorieProduitId!=null && errorsQuery?.categorieProduitId.length>0 ? 'is-invalid' : ''}`}
                        menuPortalTarget={document.body}
                        menuPosition={'fixed'} 
                        styles={{
                          ///.....
                          menuPortal: provided => ({ ...provided, zIndex: 9999 }),
                          menu: provided => ({ ...provided, zIndex: 9999 })
                          ///.....
                        }}
                        />                       
                      <div className="invalid-feedback">{errors?.categorieProduitId}</div>
                    </div>
                    <div className="form-group">             
                      <input
                        type="text"                       
                        id="tags"
                        required
                        value={query.tags}
                        onChange={handleQueryChange}
                        name="tags"
                        placeholder="Tags"
                        maxLength="100"
                        className={`form-control form-control-sm ${errorsQuery.tags.length>0 ? 'is-invalid' : ''}`}
                      />
                       <div className="invalid-feedback">{errorsQuery.tags}</div>
                    </div>
                 

        </div>
         <div className="col-md-6" >
    
            <div className="form-group">             
                      <Select
                       defaultValue={query.marque!=""?{"valid":query.marque, "label":query.marque}:""}
                       getOptionLabel={e => e.label}
                        getOptionValue={e => e.value}
                        isClearable={true}
                       onChange={(e) => {
                        let q=query;
                        if(e!=null)       
                            q.marque=e.value
                          else
                             q.marque=""
 
                           setQuery(q)
                            
                        }}
                        options={marques}
                        placeholder={'Marque'}
                        className={`${errorsQuery.marque.length>0 ? 'is-invalid' : ''}`}
                        />
                       <div className="invalid-feedback">{errorsQuery.marque}</div>
                    </div>
                  <div className="form-group">     
                    <Select

                       defaultValue={query.modele}
                       getOptionLabel={e => e.label}
                        getOptionValue={e => e.value}
                        isClearable={true}
                       onChange={(e) => {
                         let q=query;
                        if(e!=null)       
                            q.modele=e.value
                          else
                             q.modele=""
 
                           setQuery(q)
                            console.log(query);
                        }}
                        options={modeles}
                        placeholder={`Modèle`}
                        className={`${errorsQuery.modele.length>0 ? 'is-invalid' : ''}`}
                        />        
                 
                      <div className="invalid-feedback">{errorsQuery.modele}</div>
                    </div> 
                     <div className="form-group">     
                    <select id="actif" name="actif" onChange={handleQueryChange} value={query.actif}  className={`form-select form-select-sm ${errorsQuery.actif.length>0 ? 'is-invalid' : ''}`}>
                      <option disabled={false} value="">Tous</option>
                      <option value={true}>Actif</option>
                      <option value={false}>Déactivé</option>
                      
                   </select>        
                 
                      <div className="invalid-feedback">{errorsQuery.actif}</div>
                    </div> 
<div className="text-danger" style={{ fontSize:"12px"}}>{errorsQuery.remarque}</div>
        </div>
     <div className="col-md-2 align-self-end" >
      
 
         <i className="fa fa-search btn-search"
                      onClick={() => rechercherProduits()} /> 
         
     </div>
 
    </div>
</div>
<div className="col-md" >
</div>

</div>
  )}
const renderShowProduit =()=> {
return (
   <div className="row">


 <section className="accordion">
              <input type="radio" name="collapse" id="InfoGenerale" defaultChecked/>
              <h2 className="handle">
                <label htmlFor="InfoGenerale">Information générale</label>
              </h2>
              <div className="content">
               <div className="row"> 
                <div className="col-md"> 
                <table className={Styles.styledTable}>
                <tbody>
                    <tr><th className="table-active">Code</th><td>{produit.codeProduit}</td></tr>
                    <tr><th className="table-active">Code barre/QR Code</th><td>{produit.codeBarre}</td></tr>
                    <tr><th className="table-active">Libelle</th><td>{produit.libelle}</td></tr>
                    <tr><th className="table-active">Categorie de produit</th><td>{Utils.trouverObjetDansListObject(categorieProduits,"categorieProduitId",produit.categorieProduitId)?.libelleParent}</td></tr>
                   <tr><th className="table-active">Type de produit</th><td>{produit.typeProduit}</td></tr>
                   <tr><th className="table-active">Fabricant</th><td>{produit.fabricant}</td></tr>
                   <tr><th className="table-active">Description</th><td>{produit.description}</td></tr>
                   <tr><th className="table-active">Produit à vendre</th><td>{produit.soumisALaVente==true? "Oui":"Non"}</td></tr>  
                    <tr><th className="table-active">Produit périssable</th><td>{produit.perissable==true? "Oui":"Non"}</td></tr>  
                    <tr><th className="table-active">Actif</th><td>{produit.actif==true? "Oui":"Non"}</td></tr>  
                    <tr><th className="table-active">Prix de vente</th><td>{produit.prixVente} {globalObject?.entreprise.config?.deviseMonetaire}</td></tr>
                   <tr><th className="table-active">Conditionnement à la vente</th><td>{produit.conditionnementVente}</td></tr>
                    <tr><th className="table-active">Tags</th><td>{produit.tags}</td></tr>
                   <tr><th colSpan="2" className="table-active">Description:</th></tr>
                    <tr><td colSpan="2">{produit.description}</td></tr>
                                                               
                </tbody>
              </table>
                </div>
          </div>
        </div>
      </section>

<section className="accordion">
              <input type="radio" name="collapse" id="autreInfo"/>
              <h2 className="handle">
                <label htmlFor="autreInfo">Autres Informations</label>
              </h2>
              <div className="content">
               <div className="row"> 
                    <div className="col-md"> 

                 <table className={Styles.styledTable}>
                <tbody>
                  <tr><th className="table-active">Poids</th><td>{produit.poids} g</td></tr>
                    <tr><th className="table-active">Volume</th><td>{produit.volume} cm3</td></tr>
                    <tr><th className="table-active">Marque</th><td>{produit.marque}</td></tr>
                   <tr><th className="table-active">Modèle</th><td>{produit.modele}</td></tr>
                   <tr><th className="table-active">Unité de mesure</th><td>{produit.uniteDeMesure}</td></tr>       
                    <tr><th colSpan="2" className="table-active">Remarque:</th></tr>
                    <tr><td colSpan="2">{produit?.remarque}</td></tr>
                    <tr><th className="table-active">Actif</th><td>{produit.actif==true? "Oui":"Non"}</td></tr>  
                   {permission?.action?.includes("CRUD")&& <tr><th className="table-active">User</th><td>{produit.userId}</td></tr>}
                    <tr><th className="table-active">Modifié le</th><td>{produit.dateModif}</td></tr>                              
                                 
                </tbody>
              </table>
                   </div>
           </div>
          </div>
    </section>

            <div className="col-md">                               
                   
                    
               </div>
              <div className="col-md"> 
                    
            </div>
          <section className="accordion">
              <input type="radio" name="collapse" id="photos"/>
              <h2 className="handle">
                <label htmlFor="photos">Photos</label>
              </h2>
              <div className="content">
                  <div className="form-group for" >  
                     <label>Photos</label> 
                        {<LoadFiles key={guid} showImage={true} label={"selectedFiles"} multiFile={true} action={perform.action} selectedFiles={selectedFiles} handleLoadFiles={handleLoadFiles}/>}
                    </div>
              </div>

            </section>



    {produit.typeProduit=="Stockable"&&(
                     
            <section className="accordion">
              <input type="radio" name="collapse" id="approvisionnement"/>
              <h2 className="handle">
                <label htmlFor="approvisionnement">Approvisionnement</label>
              </h2>
              <div className="content">
               <div className="row"> 
                <div className="col-md"> 
            <table className={Styles.styledTable}>
                <tbody>
                  <tr><th className="fw-bold">Fournisseur</th><td>{produit?.approvisionnement?.fournisseur?.libelle}</td></tr>
                  <tr><th className="fw-bold">Fournisseur</th><td>{produit?.approvisionnement?.fournisseur?.prixAchat} {globalObject?.entreprise.config?.deviseMonetaire}</td></tr>
                    <tr><th className="fw-bold">Conditionnement à l'achat</th><td>{produit?.approvisionnement?.conditionnementAchat}</td></tr>
                    <tr><th className="fw-bold">Réapprovisionnement Automatique</th><td>{produit.reapprovisionnementAuto==true? "Oui":"Non"}</td></tr>  
                     <tr><th colSpan="2" className="fw-bold">Remarque:</th></tr>
                    <tr><td colSpan="2">{produit?.approvisionnement?.remarque}</td></tr>
                </tbody>
              </table>

                 </div>
                </div>
                </div>
            </section>)}
              </div>
  )}

const renderFormProduit=() =>{
    /* "libelle": "",
        "codeProduit": "", 
        "description": "",     
        "fabricant": "",
        "marque": "",
        "modele": "",
        "typeProduit": "",
        "categorieProduit":{},
        "categorieProduitId":"",
        "photos":{},
        "uniteDeMesure": "",
        "prixVente": 0,
        "codeBarre": "",
        "tags": "",
        "conditionnementVente": "",
        "soumisALaVente": false,
        "approvisionnement": {},
        "reapprovisionnementAuto": false,
        "poids": 0.0,
        "volume": 0.0,*/
return (

   <div className="row">

    <section className="accordion">
              <input type="radio" name="collapse" id="InfoGenerale" defaultChecked/>
              <h2 className="handle">
                <label htmlFor="InfoGenerale">Information générale</label>
              </h2>
              <div className="content">
               <div className="row"> 
                <div className="col-md"> 
                  <div className="form-group">             
                      <input
                        type="text"                       
                        id="codeProduit"
                        required
                        value={produit.codeProduit}
                        onChange={handleProduitChange}
                        name="codeProduit"
                        placeholder="Code/Référence Produit"
                        maxLength="100"
                        className={`form-control form-control-sm ${errors.codeProduit.length>0 ? 'is-invalid' : ''}`}
                      />
                       <div className="invalid-feedback">{errors.codeProduit}</div>
                    </div>
                    <div className="form-group">             
                      <input
                        type="text"                       
                        id="codeBarre"
                        required
                        value={produit.codeBarre}
                        onChange={handleProduitChange}
                        name="codeBarre"
                        placeholder="Code barre/QR Code"
                        maxLength="100"
                        className={`form-control form-control-sm ${errors.codeBarre.length>0 ? 'is-invalid' : ''}`}
                      />
                       <div className="invalid-feedback">{errors.codeBarre}</div>
                    </div>
                   <div className="form-group">             
                      <input
                        type="text"                       
                        id="libelle"
                        required
                        value={produit.libelle}
                        onChange={handleProduitChange}
                        name="libelle"
                        placeholder="Libellé"
                        maxLength="100"
                        className={`form-control form-control-sm ${errors.libelle.length>0 ? 'is-invalid' : ''}`}
                      />
                       <div className="invalid-feedback">{errors.libelle}</div>
                    </div>
                   <div className="form-group" >     
                    <Select
                        
                       defaultValue={produit.categorieProduit!=null&&produit.categorieProduit.categorieProduitId!=null?produit.categorieProduit:""}
                       getOptionLabel={e => Utils.trouverObjetDansListObject(categorieProduits,"categorieProduitId",e.categorieProduitId)?.libelleParent}
                        getOptionValue={e => e.categorieProduitId}
                       isClearable={true}
                       onChange={(newValue) => { 
                            let obj={ ...produit}                                             
                              if(newValue!=null)                           
                               {
                                obj.categorieProduitId=newValue.categorieProduitId
                                obj.categorieProduit=newValue;                                 
                               } 
                                else
                             {
                                    obj.categorieProduitId=initialProduitState.categorieProduitId 
                                    obj.categorieProduit=initialProduitState.categorieProduit
                                }   
                              setProduit(obj);
                              
                              }
                          }
                        noOptionsMessage={() => 'Aucune correspondance'}
                        options={categorieProduits}
                        placeholder={`Categorie de produit`}
                        className={`form-control-sm px-0 ${errors?.categorieProduitId!=null && errors?.categorieProduitId.length>0 ? 'is-invalid' : ''}`}
                        menuPortalTarget={document.body}
                        menuPosition={'fixed'} 
                        styles={{
                          ///.....
                          menuPortal: provided => ({ ...provided, zIndex: 9999 }),
                          menu: provided => ({ ...provided, zIndex: 9999 })
                          ///.....
                        }}
                        />                       
                      <div className="invalid-feedback">{errors?.categorieProduitId}</div>
                    </div>
                     
                    <div className="form-group" >  
                    <CreatableSelect
                       isClearable={true}
                        
                        value={produit.fabricant!=""? {"value":produit.fabricant, "label":produit.fabricant}:""}                   
                       onChange={(obj: any, actionMeta: any) => {
                             if(obj!=null&&obj.value!="")
                             {
                                 if(obj.modeleId==null)
                                 {
                                  Utils.addModele("Fabricant",obj.value,"")
                                 obj.modeleId=Utils.uuidv4()
                                 fabricants.push(obj)
                                 }
                                 
                            
                            setProduit({ ...produit, "fabricant": obj.value });
                            }
                          }}
                      
                        options={fabricants}
                         placeholder={`Fabricant`}
                        name="fabricant"
                        noOptionsMessage={() => 'Aucune correspondance'}
                        formatCreateLabel={(value) => `Ajouter "${value}"`}
                      className={`form-control-sm px-0 ${errors?.fabricant!=null && errors?.fabricant.length>0 ? 'is-invalid' : ''}`}                       
                       menuPortalTarget={document.body}
                        menuPosition={'fixed'} 
                        styles={{
                          ///.....
                          menuPortal: provided => ({ ...provided, zIndex: 9999 }),
                          menu: provided => ({ ...provided, zIndex: 9999 })
                          ///.....
                        }}
                      /> 
                      <div className="invalid-feedback">{errors?.fabricant}</div>
                    </div>
                     <div className="form-group">     
                    <select id="actif" name="actif" onChange={handleProduitChange} value={produit.actif}  className={`form-select form-select-sm ${errors.actif.length>0 ? 'is-invalid' : ''}`}>
                      <option disabled={true} value="">Actif</option>
                      <option value={true}>Oui</option>
                      <option value={false}>Non</option>
                      
                   </select>        
                 
                      <div className="invalid-feedback">{errors.actif}</div>
                    </div>
                  </div>
                <div className="col-md"> 
                 <div className="form-group">     
                    <select id="typeProduit" name="typeProduit" onChange={handleProduitChange} value={produit.typeProduit}
                      className={`form-select form-select-sm ${errors.typeProduit.length>0 ? 'is-invalid' : ''}`}>
                      <option disabled={true} value="">Type de produit</option>
                      <option value="Stockable">Stockable</option>
                      <option value="Consommable">Consommable</option>
                      <option value="Service">Service</option>
                   </select>        
                 
                      <div className="invalid-feedback">{errors.typeProduit}</div>
                    </div>
                    <div className="custom-control custom-checkbox custom-control-inline form-inline ">
                      <input type="checkbox" 
                      className="custom-control-input d-inline-block"
                       id="perissable"  
                       defaultChecked={produit.perissable}  
                      onClick={(event) => {
                                      let obj={ ...produit}
                                      let value= event.target.checked;
                                      obj.perissable=value;                                                              
                                      setProduit(obj)                                      
                                     }}
                        />
                      <label className="custom-control-label d-inline-block" htmlFor="perissable">Produit périssable</label>
                    </div>
                    <div className="custom-control custom-checkbox custom-control-inline form-inline">
                      <input type="checkbox" 
                      className="custom-control-input d-inline-block"
                       id="soumisALaVente"  
                       defaultChecked={produit.soumisALaVente}  
                      onClick={(event) => {
                                      let obj={ ...produit}
                                      let value= event.target.checked;
                                      obj.soumisALaVente=value;                                                              
                                      setProduit(obj)                                      
                                     }}
                        />
                      <label className="custom-control-label d-inline-block" htmlFor="soumisALaVente">Produit soumis à la vente</label>
                    </div>
                    {produit.soumisALaVente&&(
                    <div>
                     <div className="form-group custom-control-inline form-inline">             
                      <input
                      type="text"                     
                        id="prixVente"
                        required
                        value={produit.prixVente}
                        onChange={handleProduitChange}
                        name="prixVente"
                        placeholder='Prix de vente'
                        maxLength="7"
                        className={`form-control form-control-sm d-inline-block ${errors.prixVente.length>0 ? 'is-invalid' : ''}`}
                      />{globalObject?.entreprise.config?.deviseMonetaire}
                       <div className="invalid-feedback">{errors.prixVente}</div>
                    </div>
                     <div className="form-group" >  
                    <CreatableSelect
                        isClearable
                        
                        value={produit.conditionnementVente!=""? {"value":produit.conditionnementVente, "label":produit.conditionnementVente}:""}                   
                       onChange={(obj: any, actionMeta: any) => {
                             if(obj!=null&&obj.value!="")
                             {
                                 if(obj.modeleId==null)
                                 {
                                 Utils.addModele("Conditionnement",obj.value,"")
                                 obj.modeleId=Utils.uuidv4()
                                 conditionnements.push(obj)
                             }
                            
                            setProduit({ ...produit, "conditionnementVente": obj.value });
                            }
                          }}
                      
                        options={conditionnements}
                         placeholder={`Conditionnement à la vente`}
                        name="conditionnementVente"
                        noOptionsMessage={() => 'Aucune correspondance'}
                        formatCreateLabel={(value) => `Ajouter "${value}"`}
                        className={`form-control-sm px-0 ${errors?.conditionnementVente!=null && errors?.conditionnementVente.length>0 ? 'is-invalid' : ''}`}  
                       menuPortalTarget={document.body}
                        menuPosition={'fixed'} 
                        styles={{
                          ///.....
                          menuPortal: provided => ({ ...provided, zIndex: 9999 }),
                          menu: provided => ({ ...provided, zIndex: 9999 })
                          ///.....
                        }}
                      /> 
                      <div className="invalid-feedback">{errors?.conditionnementVente}</div>
                    </div>
                    </div>
                    )}
                    <div className="form-group">

                     <CreatableSelect
                       isClearable={true}
                        isMulti
                        defaultValue={produit.tags!=null &&produit.tags!=""?Utils.stringToArray(produit.tags):""}
                        getOptionLabel={e => e.value}
                        getOptionValue={e => e.value}
                        onChange={(e: any, actionMeta: any) => {      
                          let values=""
                          if(e!=null && e.length>0)       
                          {  
                           let x=e.length-1
                            if(e[x].modeleId==null)
                                {
                                  Utils.addModele("Tag",e[x].value,"")
                                  let obj={}
                                  obj.value=e[x].value
                                  obj.label=e[x].label
                                  obj.model=Utils.uuidv4()
                                  let list=tags
                                  list.push(obj)
                                  setTags(list)
                                   console.log("Utils.addModele===>",e)  
                                }
                             console.log("CreatableSelect===>",e)   
                                 for (var i = 0; i < e.length; i++) {  
                                    values+=e[i].value+";"
                                   }
                                     console.log("produit.tags===>",values)                             
                                    //produit.tags=values                                 
                              }

                                 setProduit({ ...produit, "tags": values });
                            
                          }}
                      
                        options={tags}
                         placeholder={`Tags`}
                        name="tags"
                        noOptionsMessage={() => 'Aucune correspondance'}
                        formatCreateLabel={(value) => `Ajouter "${value}"`}
                      className={`form-control-sm px-0 ${errors?.tags!=null && errors?.tags.length>0 ? 'is-invalid' : ''}`}                       
                       menuPortalTarget={document.body}
                        menuPosition={'fixed'} 
                        styles={{
                          ///.....
                          menuPortal: provided => ({ ...provided, zIndex: 9999 }),
                          menu: provided => ({ ...provided, zIndex: 9999 })
                          ///.....
                        }}
                      /> 
                      <div className="invalid-feedback">{errors?.tags}</div>
                    </div>
                    
                </div>
                <div className="form-group">             
                      <textarea
                        type="text"
                        className="form-control"
                        id="description"
                        required
                        value={produit.description}
                        onChange={handleProduitChange}
                        name="description"
                        maxLength="250"
                        placeholder="Description"
                      />
                    </div>
          </div>
        </div>
      </section>




<section className="accordion">
              <input type="radio" name="collapse" id="autreInfo"/>
              <h2 className="handle">
                <label htmlFor="autreInfo">Autres Informations</label>
              </h2>
              <div className="content">
               <div className="row"> 
                    <div className="col-md"> 
                    <div className="form-group custom-control-inline form-inline">             
                      <input
                      type="text"                     
                        id="poids"
                        required
                        value={produit.poids}
                        onChange={handleProduitChange}
                        name="poids"
                        placeholder="Poids (en g)"
                        maxLength="7"
                        className={`form-control form-control-sm ${errors.poids.length>0 ? 'is-invalid' : ''}`}
                      />en g
                       <div className="invalid-feedback">{errors.poids}</div>
                    </div>
                    <div className="form-group  custom-control-inline form-inline">             
                      <input
                      type="text"                     
                        id="volume"
                        required
                        value={produit.volume}
                        onChange={handleProduitChange}
                        name="volume"
                        placeholder="Volume (en cm3)"
                        maxLength="7"
                        className={`form-control form-control-sm ${errors.volume.length>0 ? 'is-invalid' : ''}`}
                      />en cm3
                       <div className="invalid-feedback">{errors.volume}</div>
                    </div>
                     <div className="form-group" >  
                    <CreatableSelect
                        isClearable
                        
                        value={produit.uniteDeMesure!=null&&produit.uniteDeMesure!=""? {"value":produit.uniteDeMesure, "label":produit.uniteDeMesure}:""}                   
                       onChange={(obj: any, actionMeta: any) => {
                             if(obj!=null&&obj.value!="")
                             {
                                 if(obj.modeleId==null)
                                 {
                                 Utils.addModele("Unite",obj.value,"")
                                 obj.modeleId=Utils.uuidv4()
                                 uniteDeMesures.push(obj)
                             }
                           
                            setProduit({ ...produit, "uniteDeMesure": obj.value });
                            }
                          }}
                      
                        options={uniteDeMesures}
                         placeholder={`Unité de mesure`}
                        name="uniteDeMesure"
                        noOptionsMessage={() => 'Aucune correspondance'}
                        formatCreateLabel={(value) => `Ajouter "${value}"`}
                        className={`form-control-sm px-0 ${errors?.uniteDeMesure!=null && errors?.uniteDeMesure.length>0 ? 'is-invalid' : ''}`}  
                         menuPortalTarget={document.body}
                        menuPosition={'fixed'} 
                        styles={{
                          ///.....
                          menuPortal: provided => ({ ...provided, zIndex: 9999 }),
                          menu: provided => ({ ...provided, zIndex: 9999 })
                          ///.....
                        }}
                      /> 
                      <div className="invalid-feedback">{errors?.uniteDeMesure}</div>
                    </div>
                  </div>

                <div className="col-md"> 
                  <div className="form-group" >  
                    <CreatableSelect
                        isClearable
                        
                        value={produit.marque!=""? {"value":produit.marque, "label":produit.marque}:""}                   
                       onChange={(obj: any, actionMeta: any) => {
                             if(obj!=null&&obj.value!="")
                             {
                                 if(obj.modeleId==null)
                                 {
                                 Utils.addModele("Marque",obj.value,"")
                                 obj.modeleId=Utils.uuidv4()
                                 marques.push(obj)
                             }
                            
                            setProduit({ ...produit, "marque": obj.value });
                            }
                          }}
                      
                        options={marques}
                        
                        placeholder={`Marque`}
                        name="marque"
                        noOptionsMessage={() => 'Aucune correspondance'}
                        formatCreateLabel={(value) => `Ajouter "${value}"`}
                        className={`form-control-sm px-0 ${errors?.marque!=null && errors?.marque.length>0 ? 'is-invalid' : ''}`}  
                         menuPortalTarget={document.body}
                        menuPosition={'fixed'} 
                        styles={{
                          ///.....
                          menuPortal: provided => ({ ...provided, zIndex: 9999 }),
                          menu: provided => ({ ...provided, zIndex: 9999 })
                          ///.....
                        }}
                      /> 
                      <div className="invalid-feedback">{errors?.marque}</div>
                    </div>
                     <div className="form-group" >  
                    <CreatableSelect
                        isClearable
                        
                        value={produit.modele!=""? {"value":produit.modele, "label":produit.modele}:""}                   
                       onChange={(obj: any, actionMeta: any) => {
                             if(obj!=null&&obj.value!="")
                             {
                                 if(obj.modeleId==null)
                                 {
                                 Utils.addModele("Modele",obj.value,"")
                                 obj.modeleId=Utils.uuidv4()
                                 modeles.push(obj)
                             }
                           
                            setProduit({ ...produit, "modele": obj.value });
                            }
                          }}
                      
                        options={modeles}
                         placeholder={`Modèle`}
                        name="modele"
                        noOptionsMessage={() => 'Aucune correspondance'}
                        formatCreateLabel={(value) => `Ajouter "${value}"`}
                        className={`form-control-sm px-0 ${errors?.modele!=null && errors?.modele.length>0 ? 'is-invalid' : ''}`}  
                         menuPortalTarget={document.body}
                        menuPosition={'fixed'} 
                        styles={{
                          ///.....
                          menuPortal: provided => ({ ...provided, zIndex: 9999 }),
                          menu: provided => ({ ...provided, zIndex: 9999 })
                          ///.....
                        }}
                      /> 
                      <div className="invalid-feedback">{errors?.modele}</div>
                    </div>
                    

                    </div>
                  
                  
                    
                     <div className="form-group">             
                      <textarea
                        type="text"
                        className="form-control"
                        id="remarque"
                        required
                        value={produit.remarque}
                        onChange={handleProduitChange}
                        name="remarque"
                        maxLength="250"
                        placeholder="Remarque"
                      />
                    </div>
                 
               </div>

          </div>
    </section>

                <div className="col-md">                               
                   
                    
                    </div>
                    <div className="col-md"> 
                    
                  </div>
          <section className="accordion">
              <input type="radio" name="collapse" id="photos"/>
              <h2 className="handle">
                <label htmlFor="photos">Photos</label>
              </h2>
              <div className="content">
                  <div className="form-group for" >  
                     <label>Photos</label> 
                        {<LoadFiles key={guid} showImage={true} label={"selectedFiles"} multiFile={true} action={perform.action} selectedFiles={selectedFiles} handleLoadFiles={handleLoadFiles}/>}
                    </div>
              </div>

            </section>



    {produit.typeProduit=="Stockable"&&(
                     
            <section className="accordion">
              <input type="radio" name="collapse" id="approvisionnement"/>
              <h2 className="handle">
                <label htmlFor="approvisionnement">Approvisionnement</label>
              </h2>
              <div className="content">
               <div className="row"> 
                <div className="col-md"> 
                <div className="form-group" >     
                    <Select
                        
                       defaultValue={produit.approvisionnement!=null&&produit.approvisionnement.fournisseurId!=null&&produit.approvisionnement.fournisseurId!=""?
                       {"fournisseurId":produit.approvisionnement.fournisseurId,"libelle":produit.approvisionnement?.fournisseur.libelle }:""}
                       getOptionLabel={e => e.libelle}
                        getOptionValue={e => e.fournisseurId}
                       isClearable={true}
                       onChange={(newValue) => { 
                            let obj={ ...produit}                                             
                              if(newValue!=null)                           
                               {
                                if(obj.approvisionnement==null)
                                obj.approvisionnement={...initialApprovisionnementState}
                                obj.fournisseurId=newValue.fournisseurId
                                obj.approvisionnement.fournisseurId=newValue.fournisseurId
                                obj.approvisionnement.fournisseur=newValue;                                 
                               } 
                                else
                             {
                                    obj.fournisseurId=initialApprovisionnementState.fournisseurId 
                                    obj.approvisionnement=initialApprovisionnementState
                                }   
                              setProduit(obj);
                              
                              }
                          }
                        noOptionsMessage={() => 'Aucune correspondance'}
                        options={fournisseurs}
                        placeholder={`Fournisseur par défaut`}
                        className={`form-control-sm px-0 ${errors?.fournisseurId!=null && errors?.fournisseurId.length>0 ? 'is-invalid' : ''}`} />                       
                      <div className="invalid-feedback">{errors?.fournisseurId}</div>
                    </div>
                    <div className="form-group" >  
                    <CreatableSelect
                        isClearable={true}
                          
                        value={produit?.approvisionnement!=null&&produit?.approvisionnement.conditionnementAchat!=""? {"value":produit?.approvisionnement.conditionnementAchat, "label":produit?.approvisionnement.conditionnementAchat}:""}                   
                       onChange={(obj: any, actionMeta: any) => {
                             if(obj!=null&&obj.value!="")
                             {
                                 if(obj.modeleId==null)
                                 {
                                 Utils.addModele("Conditionnement",obj.value,"")
                                 obj.modeleId=Utils.uuidv4()
                                 conditionnements.push(obj)
                             }
                            
                              let prod={...produit}
                              if(prod.approvisionnement==null)
                              prod.approvisionnement={...initialApprovisionnementState}
                              prod.approvisionnement.conditionnementAchat=obj.value
                              setProduit({...prod});
                            }
                          }}
                      
                        options={conditionnements}
                         placeholder={`Conditionnement à l'achat`}
                        name="conditionnementAchat"
                        noOptionsMessage={() => 'Aucune correspondance'}
                        formatCreateLabel={(value) => `Ajouter "${value}"`}
                        className={`form-control-sm px-0 ${errors?.approvisionnement.conditionnementAchat!=null && errors?.approvisionnement.conditionnementAchat.length>0 ? 'is-invalid' : ''}`}                       
                         menuPortalTarget={document.body}
                        menuPosition={'fixed'} 
                        styles={{
                          ///.....
                          menuPortal: provided => ({ ...provided, zIndex: 9999 }),
                          menu: provided => ({ ...provided, zIndex: 9999 })
                          ///.....
                        }}
                      /> 
                      <div className="invalid-feedback">{errors?.approvisionnement.conditionnementAchat}</div>
                    </div>
                      </div>
                      <div className="col-md"> 
                  <div className="form-group custom-control-inline form-inline">             
                      <input
                      type="text"                     
                        id="prixAchat"
                        required
                        value={produit?.approvisionnement?.prixAchat}
                        onChange={event => {
                        const { name, value } = event.target;
                        let obj={...produit}
                        if(obj.approvisionnement==null)
                          obj.approvisionnement={...initialApprovisionnementState}
                        obj.approvisionnement.prixAchat=value
                        setProduit({ ...obj});
                          }}
                        name="prixAchat"
                        placeholder="Prix à l'achat"
                        maxLength="7"
                        className={`form-control form-control-sm ${errors.approvisionnement.prixAchat.length>0 ? 'is-invalid' : ''}`}
                      />{globalObject?.entreprise.config?.deviseMonetaire}
                       <div className="invalid-feedback">{errors.prixAchat}</div>
                    </div>

                     <div className="form-group">     
                    <select id="reapprovisionnementAuto" name="reapprovisionnementAuto" onChange={handleProduitChange} value={produit.reapprovisionnementAuto}  
                    className={`form-select form-select-sm ${errors.reapprovisionnementAuto.length>0 ? 'is-invalid' : ''}`}>
                      <option disabled={true} value="">Réapprovisionnement auto</option>
                      <option value={true}>Oui</option>
                      <option value={false}>Non</option>
                      
                   </select>        
                 
                      <div className="invalid-feedback">{errors.reapprovisionnementAuto}</div>
                    </div>
                  </div>
                   <div className="form-group">             
                      <textarea
                        type="text"
                        className="form-control"
                        id="approvisionnement.remarque"
                        required
                        value={produit?.approvisionnement?.remarque}
                        onChange={event => {
                        const { name, value } = event.target;
                        let obj={...produit}
                        if(obj.approvisionnement==null)
                          obj.approvisionnement={...initialApprovisionnementState}
                        obj.approvisionnement.remarque=value
                        setProduit({ ...obj});
                          }}
                        name="approvisionnement.remarque"
                        maxLength="250"
                        placeholder="Remarque"
                      />
                    </div>
                </div>
                </div>
            </section>)}


    {(errors?.errorMsg!=null&& errors?.errorMsg.length>0&&<div className="alert alert-danger" role="alert"> <p  dangerouslySetInnerHTML={{__html: errors?.errorMsg}}></p></div>)}




              </div>
  )}

const loadingInfo =()=> {
return (
<div className="container">        

      <Modal  centered show={showLoading}  animation={true} dialogClassName='modal-loading' >
        <Modal.Body>
          <div className="text-center">  
             <i class="fa fa-spinner fa-pulse" style={{fontSize:'30px'}} ></i><br/>  
             Traitement en cours...veillez patienter
           </div>
        </Modal.Body>
        
      </Modal>
</div>)
}


return (
<div className="container" > 
  
      
  <header className="jumbotron">
       <h3 className={Styles.HeaderL1} >Gestion des produits </h3>
       

<div className="container-body">
{ renderRechercheProduit()}
{loadingInfo()}
{(upload?.type!=null)&&(
       <UploadFile type={upload.type} key={upload.key}  returnData={returnData}/>)}  
<div className="submit-form">
    
    <div className="text-right">    
       <div className="custom-control custom-checkbox custom-control-inline">
      {/*  <input type="checkbox" className="custom-control-input" id="afficherTousProduit" defaultChecked={query}  
        onChange={handleActifproduitChange}/>
        <label className="custom-control-label" htmlFor="afficherTousProduit">Afficher Tous</label>
    
       <img src="/img/refresh1.png" title="Rafraichir"  alt="Rafraichir" className="iconeRefresh"
                      onClick={() => retrieveProduits()}/>
      <img src="/img/save.png" title="Nouveau type d'produit"  alt="Nouveau type d'produit" className="iconeButtonCarre"
                      onClick={() => performAction(produit,"POST")}/>  
            */}

     
        <Button  variant="info" className="btn-sm" 
                      title="Rafraichir" onClick={() => initQuery()}>
                <i className="fa fa-refresh"></i>
          </Button>
      {permission?.action?.includes("CRUD")&&
        <Button  variant="secondary" className="btn-sm" 
                      title="Uploader un fichier" onClick={() => uploadFile(".csv")}>
                <FontAwesomeIcon icon={['fas', 'file-upload']} />
          </Button>
        }
        {permission?.action?.includes("C")&&
        <Button  variant="success" className="btn-sm" 
                      title="Ajouter un produit" onClick={() => performAction(produit, "POST")}>
               <FontAwesomeIcon icon={['fas', 'fa-box']} />

          </Button> }
  
      </div>
    </div>
      <Modal  centered show={show} onHide={()=>handleClose} animation={false} dialogClassName={`${perform.result.length>0 ? 'modal-30vw' : 'modal-50vw'}`} >
       <Modal.Header >
          <Modal.Title>
          {perform.action=="POST"?("Nouveau produit"): 
          (perform.action=="GET")?("Détail sur le produit "):
          (perform.action=="PUT")?("Modifier le produit " ):
          (perform.action=="DELETE")?("Supprimer le produit" ):

         ""} </Modal.Title>
        </Modal.Header>
        <Modal.Body>
             { ( (perform.action=="POST" || perform.action=="PUT"))? (
           renderFormProduit()

           ):(perform.action=="GET" || perform.action=="DELETE")?(

             renderShowProduit()

              ):""}
        </Modal.Body>
        <Modal.Footer>
          {(produit.produitId!=null && perform.action=="GET" &&permission?.action?.includes("U"))?
          <Button variant="warning" onClick={() => performAction(produit,"PUT")}>
            Modifier
          </Button>:(perform.action=="POST" && perform.result=="")?(
            <Button className="btn  btn-block"  disabled={loading} variant="success" 
                   onClick={() => saveProduit(produit)}>
                   {loading && (
                  <span className="spinner-border spinner-border-sm"></span>
                )}
                <span>Enregistrer</span>
            
          </Button>

        
          ):(perform.action=="PUT" && perform.result=="")?(

          <Button className="btn  btn-block"  disabled={loading} variant="warning" 
                   onClick={() => saveProduit(produit)}>
                   {loading && (
                  <span className="spinner-border spinner-border-sm"></span>
                )}
                <span> Mettre à Jour</span>
            
          </Button>
           ):(perform.action=="DELETE" && perform.result=="")?(
             <Button variant="danger" onClick={() => deleteProduit(produit)}>
            Supprimer
          </Button>
          ):""
        }
        {
          <Button variant="secondary" onClick={handleClose}>
            Fermer
          </Button>
        }
        </Modal.Footer>
      </Modal>
    
    </div>

{/************************************table list*******************************/}
    {renderListOfProduit()}
    </div>
    </header>
      </div>
  );
};

export default Produits;