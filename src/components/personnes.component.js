import React, {useState, useEffect } from "react";
import PersonneDataService from "../services/personne.service";
import VilleDataService from "../services/ville.service";
import FileService from "../services/file.service";
import PieceIdentiteDataService from "../services/pieceIdentite.service";
import Utils from "../utils/utils";
import { Button,  Modal } from 'react-bootstrap';


//Bootstrap and jQuery libraries
import 'bootstrap/dist/css/bootstrap.min.css';
//import 'jquery/dist/jquery.min.js';
//Datatable Modules
import "datatables.net-dt/js/dataTables.dataTables";
import "datatables.net-dt/css/jquery.dataTables.min.css";
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

 /* eslint-disable */
const Personnes = () => {

/*Create personne code*/
const initialPersonneState = 
    { 
        "personneId": null,  
        "nom": "",
        "civilite": "",
        "nomJeuneFille": "",
        "prenoms": "",
        "situationFamilial": "",
        "dateNaissance": "",
        "dateDeces": "",
        "lieuNaissance":{
            "nomVille": ""
        },
        "sexe": "",
        "photo": "",
        "pieceIdentite": {
            "pieceIdentiteId": "",
            "numPieceIdentite": "",
            "typePiece": "",
            "dateDelivrance":"",
            "dateValidite": "",
            "delivrerPar": "",
            "scanPiece": "",
            "lienScanPiece": "",
            "remarque": ""
        },
        "lienPhoto": "",
        "numRue": "",
        "adresse": "",
        "cp": "",
        "ville": {
            "nomVille": ""
        },
        "telFixe": "",
        "telMobile": "",
        "smsAutorise": "",
        "email": "",
        "profession": "",
        "status": "",
        "remarque": "",
         "actif": ""
    };



const initialPieceIdentiteState = 
     {
        "numPieceIdentite": "",
        "typePiece": "",
        "dateDelivrance": "",
        "dateValidite": "",
        "delivrerPar": "",
        "scanPiece": "",
        "lienScanPiece": "",
        "remarque": ""
    };

    const initialPerformState = 
     {
        "action": "",
        "result": "",
        "msg": "",
       
    };
const [personne, setPersonne] = useState(initialPersonneState);
const [pieceIdentite, setPieceIdentite] = useState(initialPieceIdentiteState);
const [ville, setVille] =  useState(null);
const [lieuNaissance, setLieuNaissance] =  useState(null);
const [perform, setPerform] = useState(initialPerformState);
const [errors, setErrors] = useState(initialPersonneState);
const [previewImages, setPreviewImages] = useState([]);
const [previewImg, setPreviewImg] = useState(null);
const [selectedFiles, setSelectedFiles] = useState([]);
const [show, setShow] = useState(false);
const [personnes, setPersonnes] = useState([]);
const [villes, setVilles] = useState([]);

useEffect(() => {
    retrievePersonnes();
    //setPersonne(personne);  
      retrieveVilles();
  }, []);

useEffect(() => {
    retrieveVilles();
  }, []);

const handleClose = () => {
  setShow(false);
  let perf=perform;
  perf.result="";  
  setPerform(perf);
  //retrievePersonnes();
}
const handleCloseAndReload = () => {
  setShow(false);
  let perf=perform;
  perf.result="";  
  setPerform(perf);
  reload();
}

const handleShow = () => setShow(true);

//const today=new Date();
const handlePersonneChange = event => {
  const { name, value } = event.target;
  setPersonne({ ...personne, [name]: value });
  console.log("--------------handlePersonneChange-------------------")
  console.log(personne)
};


const handlePieceIdentiteChange = event => {
  const { name, value } = event.target;
  setPieceIdentite({ ...pieceIdentite, [name]: value });
  /*const pers = {...personne};
   pers.pieceIdentite = pieceIdentite;
  setPersonne(pers);*/
  //setPersonne({ ...personne, ['pieceIdentite']: pieceIdentite });
  const PI={...pieceIdentite}
  console.log("--------------handlePieceIdentiteChange---------------------")
  console.log(PI)
};




const newPersonne = () => {
  if(perform.action!="POST")
  {
    refreshPersonne();
  }
 
 let perf=initialPerformState;
 perf.action="POST";
  updatePerform(perf);
  //handleShow();
};

async function savePersonne (personne)  {
 console.log("--------------SAVE PERSONNE---------------------")
 const pers = {...personne};
   pers.pieceIdentite = {...pieceIdentite};
   pers.lieuNaissance = {...lieuNaissance};
   
   if(ville==null)
    pers.ville=null;
   else
   pers.ville = {...ville};

   setPersonne(pers);
   console.log(pers);
   var perf=perform;
   console.log(perf);
     if(isValid(pers))
     { 
        if(pers.pieceIdentite!=null && pers.pieceIdentite.numPieceIdentite!="")
        { //pers.pieceIdentite=null;
          console.log("-----------------TEST selectedFiles-----------------------------");
          if(selectedFiles.length>0)
          { console.log("-----------------CALL FileService-----------------------------");
              let fileInfo="";
            if(pers.pieceIdentite.scanPiece!="")
                fileInfo= await FileService.updateAsync(pers.pieceIdentite.scanPiece,selectedFiles[0], "pieceIdentite",`${personne.nom}  ${personne.prenoms} `);     
             else
                fileInfo= await FileService.uploadAsync(selectedFiles[0], "pieceIdentite",`${personne.nom}  ${personne.prenoms} `);

               console.log("-----------------scanPiece-----------------------------");
               console.log(fileInfo);
               if(fileInfo!=null && fileInfo.status=="200")
               {
                  console.log("-----------------fileInfo.fileId-----------------------------");
                  console.log(fileInfo.data.fileId);
                  pers.pieceIdentite.scanPiece=fileInfo.data.fileId;
               }
               else
                {                
                 perf.result="KO"; 
                 perf.msg="ERREUR "+fileInfo.status + " : "+ fileInfo.data.message;
                  updatePerform(perf);

               }
            }
          
          if(perf.result!="KO")
          {
            let pieceIdent="";
            if(pers.pieceIdentite.pieceIdentiteId!="")
              pieceIdent= await PieceIdentiteDataService.updateAsync(pers.pieceIdentite.pieceIdentiteId,pers.pieceIdentite);
            else
              pieceIdent= await PieceIdentiteDataService.createAsync(pers.pieceIdentite);         
            console.log("-----------------Create pieceIdentite-----------------------------");
            if(pieceIdent!=null && pieceIdent.status=="200")
              {
                  pers.pieceIdentite=pieceIdent.data;
                  console.log(pers.pieceIdentite);
              }
               else
               {
               
                perf.result="KO";
                perf.msg="ERREUR "+pieceIdent.status + " : "+ pieceIdent.data.message;                          
                updatePerform(perf);
                
                
               }
                
          }
        }else
        if (pers.pieceIdentite.numPieceIdentite=="")
        {
          pers.pieceIdentite=null;

        }
       if(perf.result!="KO")
        { console.log("-----------------Create Personne-----------------------------");
          let person="";
          if(pers.personneId!=null && pers.personneId!="")
            person= await PersonneDataService.updateAsync(pers.personneId,pers);
          else
            person= await PersonneDataService.createAsync(pers);

          if(person!=null && person.status=="200")
            {
              //pers=person.data;
              setPersonne(person.data);             
              perf.result="OK";
              if(perf.action=="POST")
                perf.msg="Enregistrement effectué avec succès" 
              else
                perf.msg="Mise à jour effectuée avec succès" 
              updatePerform(perf);    
                                            
            }  
           else
           {
            console.log("-----------------LOG PERSONNE ERROR-----------------------------");
              perf.result="KO";
              perf.msg="ERREUR "+person.status + " : "+ person.data.message;
              //setPerform(perf);
              //this.forceUpdate();
               updatePerform(perf);
               
              //await console.log(perform);
              //handleClose();
              //handleShow();
           }
            
        }

     /* PersonneDataService.create(pers)
      .then(response => {
        setPersonne(response.data);
       
        setAction("POST_OK");
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });*/
   } 
  };



/******************************************/

const reload=()=>window.location.reload();

function updatePerform  (perf) {
  setPerform(perf);
  setShow(false);
  setShow(true);
}
const retrieveVilles = () => {
    VilleDataService.getAll()
      .then(response => {
        setVilles(response.data);

        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
};


// The handler 
//onSelect={(event) => handleTag(event, 'tags')}
/*const handleTag = ({ target }, fieldName) => {
    const { value } = target;
    switch (fieldName) {
      case 'tags':
        console.log('Value ',  value)
        // Do your stuff here
        break;
      default:
    }
  };*/
  const retrievePersonnes = () => {
    PersonneDataService.getAll()
      .then(response => {
        setPersonnes(response.data);
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
 
setTimeout(()=>{                        
    $('#tListOfpersonne').DataTable(

      {
        "order": [[ 7, "desc" ]],
        "columnDefs": [
            {
                "targets": [ 7 ],
                "visible": false,
                "searchable": false
            }
        ],
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

  const refreshList = () => {
    retrievePersonnes();
  };

const refreshPersonne = () => {
    setPersonne(initialPersonneState);
    setPieceIdentite(initialPieceIdentiteState);
     setVille(null);
     setLieuNaissance(null);
     setErrors(initialPersonneState);
     setPreviewImg(null);
     setPreviewImages([]);
     setSelectedFiles([]);
     setPerform(initialPerformState);
  };


function isValid  (pers) {
 
    console.log("------------------SHOW PERSONNE----------------------------");
    console.log(pers);
     console.log(pieceIdentite);
    let err=initialPersonneState;
    let valid=true;
    if(pers.nom==null || pers.nom.length<2) 
     {
      err.nom="Le nom est réquis";
      valid=false;
      
     }
         
    if(pers.prenoms==null || pers.prenoms.length<2) 
      {
      err.prenoms="Prenom incorrecte";

      valid=false;
     } 
    if(pers.situationFamilial==null || pers.situationFamilial=="") 
      {
      err.situationFamilial="Situation familial incorecte";
      valid=false;
     } 
     if(pers.sexe==null || pers.sexe=="") 
      {
      err.sexe="Sexe incorecte";
      valid=false;
     } 
    if( pers.lieuNaissance.nomVille==null || pers.lieuNaissance.nomVille.length<2) 
       {
         err.lieuNaissance.nomVille="Lieu de Naissance incorrecte";
         valid=false;
     } 
  
    if(pers.dateNaissance==null || !Utils.validDate(Utils.formatDate(pers.dateNaissance))) 
         {
          err.dateNaissance="Date de naissance incorrecte";
          valid=false;
     } 
     if(pers.dateDeces.length>0 && !Utils.validDate(Utils.formatDate(pers.dateDeces))) 
         {
          err.dateDeces="Date de décès incorrecte";
          valid=false;
     } 
     if(pers.actif==null || pers.actif.length<2) 
         {
          err.actif="indiquer le statut actif oui non ";
          valid=false;
     }
    if( pers.telFixe.length>0 && !Utils.validateMobileNumber(pers.telFixe)) 
       {
          err.telFixe="Téléphone incorrecte";
          valid=false;
     } 
    if( pers.telMobile.length>0 && !Utils.validateMobileNumber(pers.telMobile)) 
        {
          err.telMobile="Téléphone incorrecte";
          valid=false;
        } 
    if( pers.smsAutorise.length>0 && pers.smsAutorise=="") 
        {
          err.smsAutorise="indiqué si le SMS est Autorisé";
          valid=false;
        }
    if( pers.email.length>0 && !Utils.validateEmail(pers.email)) 
       {
          err.email="Email incorrecte";
          valid=false;
     }
     if(pers.pieceIdentite!=null)
     {
          if( (pers.pieceIdentite.typePiece.length>0 || pers.pieceIdentite.dateValidite.length>0 ||
            pers.pieceIdentite.dateDelivrance.length>0 || pers.pieceIdentite.delivrerPar.length>0 ) &&
          pers.pieceIdentite.numPieceIdentite.length==0 ) 
           {
              err.pieceIdentite.numPieceIdentite="N° de piece d'identité incorrecte";
              valid=false;
         }

         if( (pers.pieceIdentite.numPieceIdentite.length>0 && pers.pieceIdentite.dateDelivrance=="") ||
          pers.pieceIdentite.dateDelivrance.length>0 && !Utils.validDate(Utils.formatDate(pers.pieceIdentite.dateDelivrance))    ) 
           {
              err.pieceIdentite.dateDelivrance="Date de délivrance incorrecte";
              valid=false;
         }
         if( (pers.pieceIdentite.numPieceIdentite.length>0 && pers.pieceIdentite.dateValidite=="") ||
          pers.pieceIdentite.dateValidite.length>0 && !Utils.validDate(Utils.formatDate(pers.pieceIdentite.dateValidite))) 
           {
              err.pieceIdentite.dateValidite="Date de validité  incorrecte";
              valid=false;
         }
         if( pers.pieceIdentite.numPieceIdentite.length>0 && pers.pieceIdentite.delivrerPar=="") 
           {
              err.pieceIdentite.delivrerPar="Préciser délivrer par";
              valid=false;
         }

          if( pers.pieceIdentite.numPieceIdentite.length>0 && pers.pieceIdentite.typePiece=="") 
           {
              err.pieceIdentite.typePiece="Type de piece incorrecte";
              valid=false;
         }
      }

  setErrors(err);
  //setTimeout(()=>{ }, 200);
  console.log("-----------------SHOW ERRORS AFTER-----------------------------");
  console.log(errors);
  console.log("-----------------Cherck form result-----------------------------");
  console.log(valid);
    return valid;

  };

async function deletePersonne(pers) {
  if(pers.personneId!=null && pers.personneId!="")
  {
      pers.actif=false;
      let perf=perform;
    let person=await PersonneDataService.updateAsync(pers.personneId,pers);
    if(person!=null && person.status=="200")
      {
          setPersonne(person.data);             
          perf.result="OK";
          perf.msg="Suppression effectué avec succès"  
          updatePerform(perf);    
                                        
      } 
        else
        {
             console.log("-----------------LOG PERSONNE ERROR-----------------------------");
              perf.result="KO";
              perf.msg="ERREUR "+person.status + " : "+ person.data.message;
               updatePerform(perf);

        }

    /*PersonneDataService.update(pers.personneId, pers)
      .then(response => {
        console.log(response.data);
        refreshList();
      })
      .catch(e => {
        console.log(e);
      });*/
    }
  };
const performAction = (personne, index, action) => {
    handleClose();

    setPersonne(personne);
    if (personne.pieceIdentite!=null) {
      setPieceIdentite(personne.pieceIdentite);
    } else {
       setPieceIdentite(initialPieceIdentiteState);
    }
   
   if (personne.ville!=null) {
      setVille(personne.ville);
    } else {
       setVille(null);
    }

    if (personne.lieuNaissance!=null) {
      setLieuNaissance(personne.lieuNaissance);
    } else {
       setLieuNaissance(null);
    }
    if((action=="GET" || action=="PUT" || action=="DELETE") && personne.pieceIdentite!=null && personne.pieceIdentite.scanPiece!=null)
    { setPreviewImg(null);
      FileService.getFileInfo(personne.pieceIdentite.scanPiece).then(response => {
        console.log(response.data);
        let fileInfo=response.data;
        setPreviewImg(fileInfo);
      })
      .catch(e => {
        console.log(e);
      });
    }
    let perf=perform;
    perf.action=action;
    setPerform(perf);
    setErrors(initialPersonneState);
    handleShow();
  };



return (
<div className="container">        
{/************************************Modal for add personne*******************************/}
{console.log('render called')}
<div className="submit-form">

    <div className="text-right">
     <Button variant="success" onClick={newPersonne} className="btn pull-right">
        Nouvelle personne
      </Button>
    </div>
      <Modal  centered show={show} onHide={handleClose} animation={false} dialogClassName={`${perform.result.length>0 ? 'modal-30vw' : 'modal-60vw'}`}>
       <Modal.Header closeButton>
          <Modal.Title>
          {perform.action=="POST"?("Nouvelle personne"): 
          (perform.action=="GET")?("Détail sur la personne " +(personne.numPatient!="" && personne.numPatient!=null ? "(N° Patient :"+personne.numPatient+")":"")):
          (perform.action=="PUT")?("Modifier une personne " +(personne.numPatient!="" && personne.numPatient!=null ? "(N° Patient :"+personne.numPatient+")":"")):
          (perform.action=="DELETE")?("Supprimer une personne " +(personne.numPatient!="" && personne.numPatient!=null ? "(N° Patient :"+personne.numPatient+")":"")):

         ""} </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {(perform.result.length>0)? (
            <div className="alert alert-secondary mt-2" role="alert"> 
            {  
              console.log ("=======>ERROR RESULT:"+perform.result)}
              <h4>{perform.msg}</h4>
              {(perform.result=="OK")&&(perform.action=="POST")? ( 
              <button className="btn btn-success" onClick={newPersonne}>
               Nouvelle personne
              </button>
              ):""}
            </div>
          ) : ((perform.result.length==0) && (perform.action=="POST" || perform.action=="PUT"))? (
            <div className="row">
                <div className="col-md-4">
                 <h6>Identité</h6>                                 
                    <div className="form-group">             
                      <input
                        type="text"                       
                        id="nom"
                        required
                        value={personne.nom}
                        onChange={handlePersonneChange}
                        name="nom"
                        placeholder="Nom"
                        maxLength="100"
                        className={`form-control form-control-sm ${errors.nom.length>0 ? 'is-invalid' : ''}`}
                      />
                       <div className="invalid-feedback">{errors.nom}</div>
                    </div>
                    <div className="form-group">             
                      <input
                        type="text"
                        className="form-control"
                        id="nomJeuneFille"
                        required
                        value={personne.nomJeuneFille}
                        onChange={handlePersonneChange}
                        name="nomJeuneFille"
                        placeholder="Nom de Jeune Fille"
                        maxLength="100"
                        className={`form-control form-control-sm ${errors.nomJeuneFille.length>0 ? 'is-invalid' : ''}`}
                      />
                       <div className="invalid-feedback">{errors.nomJeuneFille}</div>
                    </div>
                    <div className="form-group">             
                      <input
                        type="text"
                         
                        id="prenoms"
                        required
                        value={personne.prenoms}
                        onChange={handlePersonneChange}
                        name="prenoms"
                        placeholder="Prenoms"
                        maxLength="150"
                        className={`form-control form-control-sm ${errors.prenoms.length>0 ? 'is-invalid' : ''}`}
                      />
                      <div className="invalid-feedback">{errors.prenoms}</div>
                    </div>
                    <div className="form-group"> 
                    <select id="situationFamilial" name="situationFamilial" onChange={handlePersonneChange} value={personne.situationFamilial}  className={`form-control form-control-sm ${errors.situationFamilial.length>0 ? 'is-invalid' : ''}`}>
                      <option disabled={true} value="">Situation Familiale</option>
                      <option value="Célibataire">Célibataire</option>
                       <option value="Concubinage">Concubinage</option>
                      <option value="Marié">Marié</option>
                      <option value="Séparé">Séparé</option>
                      <option value="Divorcé">Divorcé</option>
                      <option value="Veuf">Veuf</option>
                   </select>            
                     <div className="invalid-feedback">{errors.situationFamilial}</div>
                    </div>
                    <div className="form-group">     
                    <select id="sexe" name="sexe" onChange={handlePersonneChange} value={personne.sexe}  className={`form-control form-control-sm ${errors.sexe.length>0 ? 'is-invalid' : ''}`}>
                      <option disabled={true} value="">Sexe</option>
                      <option value="Masculin">Masculin</option>
                      <option value="Feminin">Feminin</option>
                      <option value="Intersexe">Intersexe</option>
                   </select>        
                   
                      <div className="invalid-feedback">{errors.sexe}</div>
                    </div>
                    <div className="form-group">
                    
                     

                     <TextField
                        id="dateNaissance"
                        label="Date de Naissance"
                        type="date" variant="standard"                    
                        //defaultValue="2017-05-24"                       
                        name="dateNaissance"
                        value={personne.dateNaissance}
                        onChange={handlePersonneChange}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        className={`form-control form-control-sm ${errors.dateNaissance.length>0 ? 'is-invalid' : ''}`}
                      />
                   {/* 
                  
                   <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <KeyboardDatePicker
                        label="Date de naissance"
                        variant="inline"
                        format="dd/MM/yyyy"
                        minDate="01/01/1900"
                        maxDate={new Date()}
                        disableFuture={true}
                        value={personne.dateNaissance==""? {today}:personne.dateNaissance}
                        onChange={(date) => {
                                    
                                    setPersonne({ ...personne, ["dateNaissance"]: date });
                                  }}
                      />
                      
                    </MuiPickersUtilsProvider>            
                     } <input
                        type="text"
                        className="form-control"
                        id="dateNaissance"
                        required
                        value={personne.dateNaissance}
                        onChange={handlePersonneChange}
                        name="dateNaissance"
                        placeholder="Date de Naissance"
                        maxLength="10"
                     className={`form-control form-control-sm ${errors.dateNaissance.length>0 ? 'is-invalid' : ''}`}
                      />*/}
                      <div className="invalid-feedback">{errors.dateNaissance}</div>

                    </div>
                    <div className="form-group"> 
                        <div className="invalid-feedback"> {errors.lieuNaissance.nomVille}</div>

                       <Autocomplete
                          id="personne.lieuNaissance"
                          value={lieuNaissance}
                          noOptionsText={'Aucune correspondance'}
                          onChange={(event, newValue) => {
                                const pers=personne;
                                pers.lieuNaissance=newValue;
                                setLieuNaissance(newValue);
                                setPersonne(pers);
                                console.log("----------lieuNaissance---------------")
                                console.log(pers);
                              }}
                          options={villes}
                          getOptionLabel={(option) => `${option.nomVille} (${option?.pays?.nomPays})`} 
                        //getOptionSelected={(option, value) => option === personne.lieuNaissance}

                          renderInput={params => (
                            <TextField
                              {...params}
                              label="Ville de Naissance"
                              //name="nomVille"
                              fullWidth
                              margin="normal"
                              className={`form-control form-control-sm ${errors.lieuNaissance.nomVille.length>0 ? 'is-invalid' : ''}`}

                            />
                          )}
                          
                        />                     
                    </div> 
                  
                    <div className="form-group">
                    <TextField
                        id="dateDeces"
                        label="Date de Décès"
                        type="date" variant="standard"                    
                        //defaultValue="2017-05-24"                       
                        name="dateDeces"
                        value={personne.dateDeces}
                        onChange={handlePersonneChange}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        className={`form-control form-control-sm ${errors.dateDeces.length>0 ? 'is-invalid' : ''}`}
                      />             
                    
                      <div className="invalid-feedback">{errors.dateDeces}</div>
                    </div>
                     <div className="form-group">     
                    <select id="actif" name="actif" onChange={handlePersonneChange} value={personne.actif}  className={`form-control form-control-sm ${errors.actif.length>0 ? 'is-invalid' : ''}`}>
                      <option disabled={true} value="">Actif</option>
                      <option value={true}>Oui</option>
                      <option value={false}>Non</option>
                      
                   </select>        
                 
                      <div className="invalid-feedback">{errors.actif}</div>
                    </div>
                     <div className="form-group">             
                      <textarea 
                        type="text"
                        className="form-control"
                        id="remarque"
                        required
                        value={personne.remarque}
                        onChange={handlePersonneChange}
                        name="remarque"
                        placeholder="Remarque"
                        maxLength="250"
                      />
                    </div>
                                                  
                          
                </div>
                <div className="col-md-4">
                 <h6>Coordonnés</h6>
                   <div className="form-group">             
                      <input
                        type="text"
                        className="form-control"
                        id="numRue"
                        required
                        value={personne.numRue}
                        onChange={handlePersonneChange}
                        name="numRue"
                        placeholder="N° de Rue"
                        maxLength="10"
                      />
                    </div>
                    <div className="form-group">             
                      <input
                        type="text"
                        className="form-control"
                        id="adresse"
                        required
                        value={personne.adresse}
                        onChange={handlePersonneChange}
                        name="adresse"
                        placeholder="Adresse"
                        maxLength="150"
                      className={`form-control form-control-sm ${errors.adresse.length>0 ? 'is-invalid' : ''}`}
                      />
                      <div className="invalid-feedback">{errors.adresse}</div>
                    </div>
                    <div className="form-group">             
                      <input
                        type="text"
                        className="form-control"
                        id="cp"
                        required
                        value={personne.cp}
                        onChange={handlePersonneChange}
                        name="cp"
                        placeholder="Code postale"
                        maxLength="50"
                      className={`form-control form-control-sm ${errors.cp.length>0 ? 'is-invalid' : ''}`}
                      />
                      <div className="invalid-feedback">{errors.cp}</div>
                    </div>
                    <div > 

                       <Autocomplete
                          id="personne.ville"
                          noOptionsText={'Aucune correspondance'}
                          value={ville}
                           onChange={(event, newValue) => {
                                const pers=personne;
                                pers.ville=newValue;
                                setVille(newValue);
                                setPersonne(pers);

                                console.log("----------Ville--------------")
                                console.log(pers);
                              }}
                          options={villes}
                          getOptionLabel={(option) => `${option.nomVille} (${option?.pays?.nomPays})`} 
                          //getOptionSelected={(option, value) => option.nomVille === lieuNaissance.nomVille}

                          renderInput={params => (
                            <TextField
                              {...params}
                              label="Ville"
                              //name="nomVille"
                              fullWidth
                              margin="normal"
                            />
                          )}
                          
                        />            
                  
                      <div className="invalid-feedback">{errors.ville.nomVille}</div>
                    </div>
                    <div className="form-group">             
                      <input
                        type="text"
                        className="form-control"
                        id="telFixe"
                        required
                        value={personne.telFixe}
                        onChange={handlePersonneChange}
                        name="telFixe"
                        placeholder="Téléphone Fixe"
                        maxLength="20"
                      className={`form-control form-control-sm ${errors.telFixe.length>0 ? 'is-invalid' : ''}`}
                      />
                      <div className="invalid-feedback">{errors.telFixe}</div>
                    </div>
                    <div className="form-group">             
                      <input
                        type="text"
                        className="form-control"
                        id="telMobile"
                        required
                        value={personne.telMobile}
                        onChange={handlePersonneChange}
                        name="telMobile"
                        placeholder="Téléphone Mobile"
                       maxLength="20"
                      className={`form-control form-control-sm ${errors.telMobile.length>0 ? 'is-invalid' : ''}`}
                      />
                      <div className="invalid-feedback">{errors.telMobile}</div>
                    </div>
                    <div className="form-group">
                    <select id="smsAutorise" name="smsAutorise" onChange={handlePersonneChange} value={personne.smsAutorise}  className={`form-control form-control-sm ${errors.smsAutorise.length>0 ? 'is-invalid' : ''}`}>
                      <option disabled={true} value="">SMS Autorisé</option>
                      <option value={true}>Oui</option>
                      <option value={false}>Non</option>
                    
                   </select>               
                   
                       <div className="invalid-feedback">{errors.smsAutorise}</div>
                    </div>

                    <div className="form-group">             
                      <input
                        type="text"
                        className="form-control"
                        id="email"
                        required
                        value={personne.email}
                        onChange={handlePersonneChange}
                        name="email"
                        placeholder="Email"
                        maxLength="50"
                     className={`form-control form-control-sm ${errors.email.length>0 ? 'is-invalid' : ''}`}
                      />
                      <div className="invalid-feedback">{errors.email}</div>
                    </div>
                     <div className="form-group">

                       <select id="profession" name="profession" onChange={handlePersonneChange} value={personne.profession}  className={`form-control form-control-sm ${errors.profession.length>0 ? 'is-invalid' : ''}`}>
                            <option disabled={true} value="">Profession</option>
                            <option value="Agriculteurs">Agriculteurs</option>
                             <option value="Artisan">Artisan</option>
                            <option value="Commerçant">Commerçant et assimilés</option>
                            <option value="Chefs d’entreprise">Chefs d’entreprise </option>
                            <option value="Professions libérales">Professions libérales</option>
                            <option value="Cadres de la fonction publique">Cadres de la fonction publique</option>
                            <option value="Professeurs">Professeurs, professions scientifiques</option>
                            <option value="L'information, des arts et des spectacles">Professions de l’information, des arts et des spectacles</option>
                            <option value="Cadres administratifs">Cadres administratifs et commerciaux d’entreprise</option>
                            <option value="Ingénieurs">Ingénieurs et cadres techniques d’entreprise</option>
                            <option value="Instituteurs">Professeurs des écoles, instituteurs et assimilés</option>
                            <option value="Santé et du travail social ">Professions intermédiaires de la santé et du travail social</option>
                            <option value="Clergé/religieux">Clergé, religieux</option>
                            <option value="Techniciens">Techniciens</option>
                            <option value="Employés civils et agents de service">Employés civils et agents de service de la fonction publique</option>
                            <option value="Policiers et militaires">Policiers et militaires </option>
                            <option value="Employés administratifs">Employés administratifs d’entreprise</option>
                            <option value="Employés de commerce">Employés de commerce</option>
                            <option value="Services aux particuliers">Personnels des services directs aux particuliers </option>
                            <option value="Ouvriers industriel">Ouvriers industriel</option>
                            <option value="Ouvriers artisanal">Ouvriers artisanal </option>
                            <option value="Ouvriers agricoles">Ouvriers agricoles</option>
                            <option value="Chauffeurs">Chauffeurs</option>
                            <option value="Chômeurs">Chômeurs</option>
                            <option value="Élèves/étudiants">Élèves/étudiants</option>
                             <option value="Autre">Autre</option>
                      </select>             
                   
                      <div className="invalid-feedback">{errors.profession}</div>
                    </div>
                  </div>
                  <div className="col-md-4">
                 <h6>Piéce d'identité</h6>
                  <div className="form-group"> 
                    <select id="typePiece" name="typePiece" onChange={handlePieceIdentiteChange} value={pieceIdentite.typePiece}  
                    className={`form-control form-control-sm ${errors.pieceIdentite.typePiece.length>0 ? 'is-invalid' : ''}`}>
                      <option disabled={true} value="">Type de piece d'identité</option>
                      <option value="Carte Nationale d'Identité">Carte Nationale d'identité</option>
                      <option value="Passeport">Passeport </option>
                      <option value="Permis de Conduire">Permis de Conduire</option>
                      <option value="Carte d'étudiant">Carte d'étudiant</option>
                      <option value="Carte Professionnelle">Carte Professionnelle</option>                     
                      <option value="Carte de Séjour/Résident">Carte de séjour/résident</option>
                      <option value="Autre">Autre</option>

                   </select>                
                     
                      <div className="invalid-feedback">{errors.pieceIdentite.typePiece}</div>
                    
                    </div>
                   <div className="form-group">             
                      <input
                        type="text"        
                        id="numPieceIdentite"
                        required
                        value={pieceIdentite.numPieceIdentite}
                        onChange={handlePieceIdentiteChange}
                       /* onChange={e => {
                          const pers=personne;
                          pers.pieceIdentite.numPieceIdentite=e.target.value
                          setPersonne(pers)
                          setPieceIdentite(pers.pieceIdentite)
                          console.log("---------------------handle---------------");
                          console.log(personne);
                          }

                      }*/
                        name="numPieceIdentite"
                        placeholder="Numéro piece d'identite"
                       maxLength="50"
                     className={`form-control form-control-sm ${errors.pieceIdentite.numPieceIdentite.length>0 ? 'is-invalid' : ''}`}
                      />
                      <div className="invalid-feedback">{errors.pieceIdentite.numPieceIdentite}</div>
                    
                    </div>
                    <div className="form-group">   
                    <TextField
                        id="dateDelivrance"
                        label="Date de délivrance"
                        type="date" variant="standard"                    
                        //defaultValue="2017-05-24"                       
                        name="dateDelivrance"
                        value={pieceIdentite.dateDelivrance}
                        onChange={handlePieceIdentiteChange}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        className={`form-control form-control-sm ${errors.pieceIdentite.dateDelivrance.length>0 ? 'is-invalid' : ''}`}
                      />          
                    
                      <div className="invalid-feedback">{errors.pieceIdentite.dateDelivrance}</div>
                    </div>
                    <div className="form-group"> 
                     <TextField
                        id="dateValidite"
                        label="Date de fin de validité"
                        type="date" variant="standard"                    
                        //defaultValue="2017-05-24"                       
                        name="dateValidite"
                        value={pieceIdentite.dateValidite}
                        onChange={handlePieceIdentiteChange}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        className={`form-control form-control-sm ${errors.pieceIdentite.dateValidite.length>0 ? 'is-invalid' : ''}`}
                      />          
             
                      <div className="invalid-feedback">{errors.pieceIdentite.dateValidite}</div>
                    </div>
                    <div className="form-group">             
                      <input
                        type="text"
                        id="delivrerPar"
                        required
                        value={pieceIdentite.delivrerPar}
                        onChange={handlePieceIdentiteChange}
                        name="delivrerPar"
                        placeholder="Délivrer par"
                        maxLength="50"
                     className={`form-control form-control-sm ${errors.pieceIdentite.delivrerPar.length>0 ? 'is-invalid' : ''}`}
                      />
                      <div className="invalid-feedback">{errors.pieceIdentite.delivrerPar}</div>
                    </div>
                    <div className="form-group">
                           
                      <div className="col-8">
                        <label htmlFor="title">
                     Scan de la pièce d'identité :{previewImg?.fileName} <input
                        type="file"
                        id="scanPiece"
                        //multiple                        
                        accept="image/*"
                        //value={pieceIdentite.scanPiece}
                        //onChange={handlePieceIdentiteChange}
                        onChange={(event) => {
                                let images=[];
                                //for (let i = 0; i < event.target.files.length; i++) {
                                if(event.target.files.length>0)
                                {
                                  images.push(URL.createObjectURL(event.target.files[0]))
                                  console.log("-----Image data-----");
                                  console.log(event.target.files[0]);
                                //const PI=pieceIdentite;
                                //PI.scanPiece=event.target.files[0];
                                //setPieceIdentite(PI);
                                setSelectedFiles(event.target.files)
                                //setPersonne(pers);
                                setPreviewImages(images);
                                setPreviewImg(null);
                                }
                              }}
                        name="scanPiece"
                        placeholder="Scan de la pièce d'identité"
                      />
                      </label>
                    </div>

                      {previewImages && (
                        <div>
                          {previewImages.map((img, i) => {
                            return <img className="image-preview" src={img} 
                            //alt={"image-" + i}  
                            key={i}/>;
                          })}
                        </div>
                      )}
                      {previewImg && (
                        <div>
                          
                            <img className="image-preview" 
                            //src={previewImages} 
                            src={`data:${previewImg.fileType};base64,${previewImg.fileData}`}
                            //alt={"image-" + i}  
                            />;
                        
                        </div>
                      )}
        
                    </div>
                    <div className="form-group">             
                      <textarea
                        type="text"
                        className="form-control"
                        id="remarque"
                        required
                        value={pieceIdentite.remarque}
                        onChange={handlePieceIdentiteChange}
                        name="remarque"
                        maxLength="250"
                        placeholder="Remarque à propos de la piéce d'identité"
                      />
                    </div>

                </div>
                
              </div>):(perform.action=="GET" || perform.action=="DELETE")?(

              <div className="row">
                <div className="col-md-4">
                 <h6>Identité</h6>                
                  <div>
                    <div className="form-group"> 
                        <label htmlFor="title">Nom : {personne.nom}</label>                    
                    </div>
                    <div className="form-group"> 
                    <label htmlFor="title">Nom de Jeune Fille : {personne.nomJeuneFille}</label>   
                    </div>
                    <div className="form-group">   
                    <label htmlFor="title">Prenoms : {personne.prenoms}</label>           
                     
                    </div>
                    <div className="form-group">
                    <label htmlFor="title">Situation Familiale :{personne.situationFamilial}</label>               
                      
                    </div>
                    <div className="form-group"> 
                    <label htmlFor="title">Sexe : {personne.sexe}</label>              
                      
                    </div>
                    <div className="form-group"> 
                    <label htmlFor="title">Date de Naissance : {personne.dateNaissance}</label>              
                      
                    </div>
                    <div className="form-group"> 
                    <label htmlFor="title">Lieu de Naissance : {personne?.lieuNaissance?.nomVille}</label>   
                     
                    </div> 
                    <div className="form-group">       
                    <label htmlFor="title">Date de Décès : {personne.dateDeces}</label>        
                      
                    </div>
                    <div className="form-group">  
                     <label htmlFor="title">Actif : {personne.actif==true? "Oui":"Non"}</label>             
                    </div>
                     <div className="form-group">  
                     <label htmlFor="title">Remarque : {personne.remarque}</label>             
                    </div>
                                                  
                  </div>         
                </div>
                <div className="col-md-4">
                 <h6>Coordonnés</h6>

                   <div className="form-group">    
                   <label htmlFor="title">N° de Rue : {personne.numRue}</label>           
                      
                    </div>
                    <div className="form-group">   
                    <label htmlFor="title">Adresse : {personne.adresse}</label>            
                    </div>
                    <div className="form-group">  
                    <label htmlFor="title">Code Postal : {personne.cp}</label>             
                     
                    </div>
                    <div className="form-group">    
                    <label htmlFor="title">Ville : {personne?.ville?.nomVille}</label>           
                    </div>
                    <div className="form-group"> 
                    <label htmlFor="title">Tél. fixe : {personne.telFixe}</label>              
                    </div>
                    <div className="form-group"> 
                    <label htmlFor="Tél. Mobile">Tél. Mobile : {personne.telMobile}</label>              
                     
                    </div>
                    <div className="form-group">   
                    <label htmlFor="title">SMS Autorisé : {personne.smsAutorise==true?"Oui":(personne.smsAutorise==false?"Non":"")}</label>            
                      
                    </div>
                    <div className="form-group"> 
                    <label htmlFor="title">Email : {personne.email}</label>              
                      
                    </div>
                     <div className="form-group">  
                     <label htmlFor="title">Profession : {personne.profession}</label>             
                     
                    </div>
                </div>
                  <div className="col-md-4">
                 <h6>Piéce d'identité</h6>
                     <div className="form-group">       
                   <label htmlFor="title">Type de piece d'identité : {pieceIdentite.typePiece}</label>        
                     
                    </div>
                   <div className="form-group">       
                   <label htmlFor="title">N° piece d'identité : {pieceIdentite.numPieceIdentite}</label>        
                     
                    </div>
                    <div className="form-group">  
                    <label htmlFor="title">Date de délivrance : {pieceIdentite.dateDelivrance}</label>              
                     
                    </div>
                    <div className="form-group">    
                    <label htmlFor="title">valide jusqu'a : {pieceIdentite.dateValidite}</label>           
                     
                    </div>
                    <div className="form-group">  
                   <label htmlFor="title">Délivrer par : {pieceIdentite.delivrerPar}</label>               
                    
                    </div>
                    <div className="form-group">  
                    <label htmlFor="title">Scan pièces : {previewImg?.fileName}</label>              
                      {previewImg && (
                        <div>
                          
                            <img className="image-preview" 
                            //src={previewImages} 
                            src={`data:${previewImg.fileType};base64,${previewImg.fileData}`}
                            //alt={"image-" + i}  
                            />;
                        
                        </div>
                      )}


                    </div>
                    <div className="form-group">  
                    <label htmlFor="title">Remarque : {pieceIdentite.remarque}</label>             
                      
                    </div>

                </div>
                
              </div>


              ):""}
        </Modal.Body>
        <Modal.Footer>
          {(personne.personneId!=null && perform.action=="GET")?
          <Button variant="warning" onClick={() => performAction(personne, "","PUT")}>
            Modifier
          </Button>:(perform.action=="POST" && perform.result=="")?(
          <Button variant="success"  onClick={() => savePersonne(personne)}>
              Enregister
            </Button>
          ):(perform.action=="PUT" && perform.result=="")?(
            <Button variant="warning"  onClick={() => savePersonne(personne)}>
            Mettre à Jour
          </Button>):(perform.action=="DELETE" && perform.result=="")?(
             <Button variant="danger" onClick={() => deletePersonne(personne)}>
            Supprimer
          </Button>
          ):""
        }
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




{/************************************table list*******************************/}
    <div className="table-responsive">         
      <table id="tListOfpersonne" className="table table-striped table-bordered display compact" >
          <thead>
            <tr>
              <th>Nom</th>
                <th>Nom de Jeune Fille</th>
                <th>Prenoms</th>
                <th>Sexe</th>
               <th>Lieu de Naissance</th>
                <th>Date de Naissance</th>
                <th>Tel. Mobile</th>
                <th>Date de Modif</th>
               <th>Actions</th>
              
            </tr>
          </thead>
          <tbody>
           {personnes &&
            personnes.map((personne, index) => (
                <tr key={index}>      
                 <td>{personne.nom}</td>
                  <td>{personne.nomJeuneFille}</td>
                  <td>{personne.prenoms}</td>                  
                  <td>{personne.sexe}</td>              
                  <td>{personne.lieuNaissance!=null? personne.lieuNaissance.nomVille: ""}</td>
                  <td>{personne.dateNaissance}</td>
                  <td>{personne.telMobile}</td> 
                  <td>{personne.dateModif}</td> 
                  <td>
                      <img src="/img/read.png" title="Voir details"  alt="Voir details" className="icone-action"
                      onClick={() => performAction(personne, index,"GET")}/> 
                      <img src="/img/write.png" title="Modifier"  alt="Modifier" className="icone-action"
                      onClick={() => performAction(personne, index,"PUT")}/>
                       <img src="/img/delete.png" title="Supprimer"  alt="Supprimer" className="icone-action"
                       onClick={() => performAction(personne, index,"DELETE")}/>
                   </td>              
                </tr>
          ))}
          
          
          </tbody>
           
        </table>
         
        </div>
      </div>

  );
};

export default Personnes;