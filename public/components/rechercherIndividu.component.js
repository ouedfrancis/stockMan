import React, {useState, useEffect } from "react";
import PatientDataService from "../services/patient.service";
import PersonneDataService from "../services/personne.service";
//import Loading from "../components/loading.component";
import { Button,  Modal } from 'react-bootstrap';
 
import $ from 'jquery'; 
import 'date-fns';


 /* eslint-disable */
const RechercherIndividus = (props) => {

/*Create individu code*/
const initialRechercher= {
        "typeIndividu": "",
        "nom": "",
        "prenoms": "",
        "dateNais": "",
        "telMobile": "",
        "numPatient": "",
        "actif": true
        
       
    };

  const initialPerformState = 
     {
        "action": "",
        "result": "",
        "msg": "",      
    };  
const [individu, setIndividu] = useState({});
const [individus, setIndividus] = useState([]);
const [errors, setErrors] = useState(initialRechercher);
const [showIndividusModal, setShowIndividusModal] = useState(false);
const [rechercher, setRechercher] = useState(initialRechercher);
const [showLoading, setShowLoading] = useState(false);
const [loading, setLoading] = useState(false);
const [perform, setPerform] = useState(initialPerformState);
useEffect(() => {
    
    //retrieveIndividus();
   if(props.typeIndividu!=null && props.typeIndividu!="")
   {
     let rech=rechercher
     rech.typeIndividu=props.typeIndividu
    setRechercher(rech)
   }
    handleShowIndividusModal();
    
    //console.log ("rechercherIndividu is loading..")
  }, []);

const handleCloseIndividusModal = (close) => {
    if(close!=null && close==true)
  setShowIndividusModal(false);
else
     setShowIndividusModal(true);
  
}

const handleShowIndividusModal = () => setShowIndividusModal(true);

//const today=new Date();

const handleRechercherChange = event => {
  const { name, value } = event.target;
  setRechercher({ ...rechercher, [name]: value });

};




//const reload=()=>window.location.reload();
/******************************************/
 




async function retrieveIndividus (){
    setLoading(true)
    if ($.fn.dataTable.isDataTable('#tListOfIndividus')) {
        $('#tListOfIndividus').DataTable().destroy();       
    }
  
    

    let obj = {...rechercher};
       // console.log( obj);
       
     if(isValid(obj))
     {   
        let perf=initialPerformState;
        perf.action="FIND";
        setPerform(perf);
        setShowLoading(true)

          let response="";
          if(rechercher.typeIndividu=="Patient")   
             {
                let q="?"
             if(obj.nom!=null&&obj.nom!="")
                q+="?nom="+obj.nom
             if(obj.prenoms!=null&&obj.prenoms!="")
                q+="&prenoms="+obj.prenoms
             if(obj.dateNais!=null&&obj.dateNais!="")
                 q+="+&dateNais="+obj.dateNais
             if(obj.telMobile!=null&&obj.telMobile!="")
                 q+="&telMobile="+obj.telMobile
             if(obj.numPatient!=null&&obj.numPatient!="")
                 q+="&numPatient="+obj.numPatient
             if(obj.actif!=null&&obj.actif!="")
                 q+="&actif="+obj.actif
                response= await PersonneDataService.findAsync(q);
             } 
            
          if(response!=null && (response.status=="200"))
            {   let listIndiv=[];
                for (const item of response.data) {
                    let resp="";
                    if(props.typeIndividu=="Patient")
                         resp=await PatientDataService.findBypersonneIdAsync(item.personneId,true);
                    else
                       if(props.typeIndividu=="Praticien")
                            resp=await ProfessionelDeSanteDataService.findBypersonneIdAsync(item.personneId,true);
                    if(resp!=null && (resp.status=="200"))
                    {
                        let indiv={}
                        indiv.personneId=item.personneId;
                        indiv.nom=item.nom;
                        indiv.prenoms=item.prenoms
                        indiv.dateNaissance=item.dateNaissance
                        indiv.nomJeuneFille=item.nomJeuneFille;
                        indiv.sexe=item.sexe;
                        if(item.lieuNaissance!=null)
                        indiv.lieuNaissance=item.lieuNaissance.nomVille;
                        indiv.telMobile=item.telMobile;
                     if(props.typeIndividu=="Patient")
                      {
                        indiv.id=resp.data.patientId
                        indiv.numPatient=resp.data.numPatient
                      }  
                    else
                        if(props.typeIndividu=="Praticien")
                          {
                            indiv.id=resp.data.professionnelDeSanteId
                            indiv.numPs=resp.data.numPs
                          }  
                        else
                            if(props.typeIndividu=="Personnel")
                            {
                            indiv.id=resp.data.personnelId
                            indiv.numPersonnel=resp.data.numPersonnel
                           }
                           else
                            {
                             indiv.id=response.data.personneId
                            indiv.numPersonnel=resp.data.numPersonnel
                            }

                        listIndiv.push(indiv);
                    }

                }
                //console.log(listIndiv);
                 setIndividus(listIndiv); 

              
             perf.action="OK"           
                                                                      
            }  
           else
           {            
              setIndividus([])  ;  
               perf.action="KO"   
               perf.msg="Aucun resltat trouvé";                                   
           }   
           setPerform(perf);   


           setShowLoading(false);             
        }  



setTimeout(()=>{                        
    $('#tListOfIndividus').DataTable(

      { 
        "autoWidth": false,
        "scrollX":false,
        "scrollCollapse": true,
        "pageLength": 5,
        "columnDefs": [
            {
                "targets": [ 1 ],
                "visible": false,
                "searchable": false
            },
            {
            orderable: false,
            className: 'select-checkbox',
            targets:   0
            }
        ],
       select: {
            //style: 'multi',
            //style: 'os',
            style: 'single',
            //selector: 'td:first-child'
        },
        order: [[ 2, 'asc' ]],
        "processing": true,
        
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
          //select: true,
          "fnInitComplete": function ( oSettings ) {
               oSettings.oLanguage.sZeroRecords = "No matching records found"
           }
    }
      );


 /* var  DT1 = $('#tListOfIndividus').DataTable();
      $(".selectAll").on( "click", function(e) {
          if ($(this).is( ":checked" )) {
              DT1.rows(  ).select();        
          } else {
              DT1.rows(  ).deselect(); 
          }
      });
      */


  }, 200);

setLoading(false)
  };


async function returnIndividu (){
    
let table=$('#tListOfIndividus').DataTable();
    let data = table.rows( { selected: true } ).data();
    //console.log("data",data)
    if(data!=null)
    { 

        let indiv= individus.find((item) => {
             return item.id === data[0][1];
             })
        props.returnIndividu(props.typeIndividu, indiv);
        handleCloseIndividusModal(true);
    }else{
        let perf=initialPerformState
        perf.action="KO"
        perf.msg="Selectionner un élément dans la liste";
    }
}

function isValid  (obj) {
 
   let err=initialRechercher;
    let valid=true;
    //console.log(obj)
      
      if(obj.typeIndividu==null || obj.typeIndividu=="" || obj.typeIndividu.length<2 ) 
         {
          err.typeIndividu="Le type individus est requis ";
          valid=false;
         // console.log("obj.tarifClinique:",obj.tarifClinique)
     }


      if(obj.nom==null || obj.nom=="" || obj.nom.length<2 ) 
         {
          err.nom="Le nom est requis ";
          valid=false;
     }
    if(obj.prenoms==null || obj.prenoms=="" || obj.prenoms.length<2 ) 
         {
          err.prenoms="Le prenom est requis ";
          valid=false;
     }
 
  setErrors(err);
    return valid;
  };




const renderListIndividus=() =>{
return (

 <div className="table-responsive">         
     <table id="tListOfIndividus" className="table table-striped table-bordered display compact "  >
          <thead>
            <tr>
           <th> </th>
           <th>Identifiant</th>
            <th>N° {props.typeIndividu}</th>
            <th>Nom</th>  
             <th>Nom de jeune fille</th> 
             <th>Prénoms</th>
             <th>Date de naissance </th>
             <th>Lieu de naissance </th>
            <th>Sexe</th>                  
            <th>Téléphone Mobile </th>
                             
                {/*<th>Actif</th> 
                <th>Date de Modif</th>    
               <th></th>         */}     
            </tr>
          </thead>
          <tbody>
           {individus &&
            individus.map((indiv, index) => (
                <tr key={index}>   
                <td></td>   
                <td>{indiv.id}</td>
                <td>{(props.typeIndividu=="Praticien")?indiv.numPS:(props.typeIndividu=="Patient")?indiv.numPatient:indiv.numPersonnel}</td>
                 <td>{indiv.nom}</td>
                 <td>{indiv?.nomJeuneFille}</td> 
                 <td>{indiv?.prenoms}</td> 
                 <td>{indiv?.dateNaissance}</td> 
                 <td>{indiv.lieuNaissance}</td> 
                  <td>{indiv.sexe}</td>    
                  <td>{indiv.telMobile}</td>                              
                  {/*<td>{indiv.actif==true?"Oui":"Non"}</td>
                  <td>{indiv.dateModif}</td> */} 
                  {
                    /*(<td>
                  <img src="/img/read.png" title="Voir details"  alt="Voir details" className="icone-action"
                      onClick={() => returnIndividus(indiv)}/>                        
                   </td>   )*/}           
                </tr>
          ))}        
          </tbody>         
        </table>        
        </div>

    )}


const renderFormRechercher=() =>{
return (

<div className="row">
<div className="col-md-6">                               
                {(props.typeIndividu==null || props.typeIndividu=="")&&( 
                    <div className="form-group form-inline">     
                    Rechercher  
                    <select id="typeIndividu" name="typeIndividu" onChange={handleRechercherChange} 
                    value={rechercher.typeIndividu}  className={`form-control form-control-sm ${errors.typeIndividu.length>0 ? 'is-invalid' : ''}`}
                   //disabled
                   >
                      <option disabled={true} value="">Type Individus</option>
                      <option value="Patient">un patient</option>
                      <option value="Praticien">un praticien</option>
                      <option value="Personnel">un membre du personnel</option>
                      <option value="Personne">une personne</option>
                   </select> 
                   <div className="invalid-feedback">{errors.tarifSpecifique}</div>
                   </div>
                  
                    )}
                <div className="form-group"> 
                         
                      <input
                        type="text"                       
                        id="nom"
                        required
                        value={rechercher.nom}
                        onChange={handleRechercherChange}
                        name="nom"
                        placeholder="Nom"
                        maxLength="100"
                        className={`form-control form-control-sm ${errors.nom!=null && errors.nom.length>0 ? 'is-invalid' : ''}`}
                      />
                       <div className="invalid-feedback">{errors.nom}</div>
                    </div>
                       <div className="form-group">   
                            
                      <input
                        type="text"                       
                        id="prenoms"
                        required
                        value={rechercher.prenoms}
                        onChange={handleRechercherChange}
                        name="prenoms"
                        placeholder="prenoms"
                        maxLength="100"
                        className={`form-control form-control-sm ${errors.prenoms!=null && errors.prenoms.length>0 ? 'is-invalid' : ''}`}
                      />
                       <div className="invalid-feedback">{errors.prenoms}</div>
                    </div>
                    </div> 
                                  
              
               
                <div className="col-md-6"> 
                 

                     <Button
                className="btn  btn-block"
                disabled={loading}
                variant="success"  onClick={() => retrieveIndividus()}
              >
                {loading && (
                  <span className="spinner-border spinner-border-sm"></span>
                )}
                <span>  Rechercher</span>
              </Button>
                </div>
                
              </div>
    )}


const handleCloseLoading = () => {
  setShowLoading(true);
}

return (
<div className="container">        
{/************************************Modal for add individu*******************************/}

{(perform.action=="FIND")}
   
   
      <Modal  centered show={showIndividusModal} onHide={handleCloseIndividusModal} animation={false} dialogClassName= 'modal-50vw' >
       <Modal.Header >
          <Modal.Title>
          Rechercher {(props?.typeIndividu=="Patient")&&("un patient")} {(props?.typeIndividu=="Praticien")&&("un praticien")} {(props?.typeIndividu=="Personnel")&&("un personnel")}
          {(props?.typeIndividu=="Personne")&&("une personne")}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <div className="form-group"> 
            {renderFormRechercher ()}
            {(individus.length>0)&&(
                renderListIndividus()
                )}
            {(perform.action=="KO")&&(
               
            <div className="alert alert alert-danger mt-2" role="alert">           
              <h6>{perform.msg}</h6>
              
            </div>
          )}
        </div>
        </Modal.Body>
        <Modal.Footer>
         {(individus.length>0)&&(
          <Button variant="success"  onClick={() => returnIndividu()}>
              Selectionner
            </Button>)}         
          
          <Button variant="secondary" onClick={() =>handleCloseIndividusModal(true)}>
            Fermer
          </Button>
        
        </Modal.Footer>
      </Modal>
    
    </div>
  );
};

export default RechercherIndividus;