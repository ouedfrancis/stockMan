import React, {useState, useEffect } from "react";

//import Loading from "../components/loading.component";
import Utils from "../utils/utils";
import CsvToJson from "../utils/csvToJson";
import { Button,  Modal } from 'react-bootstrap';
 


import { TextField } from '@mui/material';


 /* eslint-disable */
const UploadFile = (props) => {

/*Create individu code*/
const initialUpload= {
        "typeFile": "",
        "data": ""
       
    };



const [showUploadModal, setShowUploadModal] = useState(false);
const [upload, setUpload] = useState(initialUpload);
useEffect(() => {
    
    //retrieveIndividus();
   if(props.typeFile!=null && props.typeFile!="")
   {
     let up=upload
     up.typeFile=props.typeFile
    setUpload(up)
   }
   setShowUploadModal(true);
    
    //console.log ("uploadIndividu is loading..")
  }, []);

const handleCloseUploadModal = (close) => {
    if(close!=null && close==true)
  setShowUploadModal(false);
else
     setShowUploadModal(true);
  
}


//const today=new Date();

const handleUploadChange = event => {
  const { name, value } = event.target;
  setUpload({ ...upload, [name]: value });

};



async function  selectFiles(event) {
    let images = [];
    let listOfFile=[]

   if(event.target.files.length>0)
        setUpload(event.target.files[0])
   //console.log("RRRRR",event.target.files[0])  
   const data= await CsvToJson.csvFileToJSON(event.target.files[0],";");                              
    props.returnData(data);
 //console.log(JSON.stringify(data));
 handleCloseUploadModal(true)
  }


const renderFormUpload=() =>{
return (

<div className="row">
<div className="col-md-6">                               
                {(props.typeFile==null || props.typeFile=="")&&( 
                    <div className="form-group form-inline">     
                   
                        <label className="btn btn-default p-0">
                       <input type="file" accept="application/csv, .csv" onChange={selectFiles}/>
                     </label>
                      </div>                 
                    )}
                </div>                 
        </div>
    )}
return (
<div className="container">        
{/************************************Modal for add individu*******************************/}


   
      <Modal  centered show={showUploadModal} onHide={handleCloseUploadModal} animation={false} dialogClassName= 'modal-25vw' >
       <Modal.Header closeButton>
          <Modal.Title>
          Upload 
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <div className="form-group"> 
            {renderFormUpload ()}
           

        </div>
        </Modal.Body>
        <Modal.Footer>
         
        {/*  <Button variant="success" >
              Upload
            </Button>    */}     
          
          <Button variant="secondary" onClick={() =>handleCloseUploadModal(true)}>
            Fermer
          </Button>
        
        </Modal.Footer>
      </Modal>
    
    </div>
  );
};

export default UploadFile;