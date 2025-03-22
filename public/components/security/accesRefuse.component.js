import React, {useState, useEffect } from "react";


import { Button,  Modal } from 'react-bootstrap';
 


import { TextField } from '@mui/material';


 /* eslint-disable */
const AccesRefuse = (props) => {



const [showInfoModal, setShowInfoModal] = useState(false);

useEffect(() => {
   setShowInfoModal(true);
    
  }, []);

const handleCloseInfoModal = (close) => {
    if(close!=null && close==true)
  {
    setShowInfoModal(false);
    if(props.perform.result=="KO-DENIED")
        window.location.href = process.env.REACT_APP_FRONTEND_URL;

}
else
     setShowInfoModal(true);
  
}


const renderFormInfo=() =>{
return (

<div className="col-md">       

{(props.perform.result!="OK")?(
              <img src="/img/del.png" title="Erreur"  alt="Erreur" className="icone50 mx-auto d-block"/>
              ):
              (
              <img src="/img/ok.png" title="OK"  alt="Ok" className="icone-40-40 mx-auto d-block"/>)}
              
              <div className="row">
              {(props.perform.result!="OK")?(
              <h6 className=" mx-auto d-block">{props.perform.msg}</h6>) :
              (<h6 className=" mx-auto d-block">{props.perform.msg}</h6>)}                        
                
    </div>                 
        </div>
    )}

return (
<div className="container">        
{/************************************Modal for add individu*******************************/}


   
      <Modal  centered show={showInfoModal} onHide={handleCloseInfoModal} animation={false} dialogClassName= 'modal-25vw' contentClassName='modal-color'>
        <Modal.Header>
         <Modal.Title>
          {props.perform.title} 
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
        <div className="form-group"> 
            {renderFormInfo ()}
        </div>
        </Modal.Body>
        <Modal.Footer>      
                           
          <Button variant="secondary" onClick={() =>handleCloseInfoModal(true)}>
            Fermer
          </Button>
        
        </Modal.Footer>
      </Modal>
    
    </div>
  );
};

export default AccesRefuse;