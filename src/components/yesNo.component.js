import React, {useState, useEffect } from "react";


import { Button,  Modal } from 'react-bootstrap';
 


import { TextField } from '@mui/material';


 /* eslint-disable */
const YesNo = (props) => {



const [showYesNoModal, setShowYesNoModal] = useState(false);

useEffect(() => {
   setShowYesNoModal(true);
    
  }, []);

const handleCloseYesNoModal = (close) => {
    if(close!=null && close==true)
  setShowYesNoModal(false);
else
     setShowYesNoModal(true);
  
}


const renderFormYesNo=() =>{
return (

<div className="col-md">
<div className="row">    
 <img src="/img/question.png" title="OK"  alt="Ok" className="icone-40-40 mx-auto d-block"/>
  </div>
<div className="row">                               
                {props.msg.value}
    </div>                 
        </div>
    )}

return (
<div className="container">        
{/************************************Modal for add individu*******************************/}


   
      <Modal  centered show={showYesNoModal} onHide={handleCloseYesNoModal} animation={false} dialogClassName= 'modal-25vw' contentClassName='modal-color'>
        <Modal.Header closeButton>
         <Modal.Title>
          Confirmation 
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
        <div className="form-group"> 
            {renderFormYesNo ()}
        </div>
        </Modal.Body>
        <Modal.Footer>      
          <Button variant="success" onClick={() =>props.handleYesNo(true)}>
              Oui
            </Button>                  
          <Button variant="secondary" onClick={() =>handleCloseYesNoModal(true)}>
            Non
          </Button>
        
        </Modal.Footer>
      </Modal>
    
    </div>
  );
};

export default YesNo;