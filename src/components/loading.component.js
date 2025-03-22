import React, {useState, useEffect } from "react";

import { Button,  Modal } from 'react-bootstrap';



 /* eslint-disable */
const Loading = (props) => {

const [showLoading, setShowLoading] = useState(false);


useEffect(() => {
        setShowLoading(props.show) ; 

        console.log("props value",props.show)
  }, []);

const handleCloseLoading = () => {
  setShowLoading(false);
}


const handleShowLoading = () => setShowLoading(true);



return (
<div className="container">        

      <Modal  centered show={showLoading} onHide={handleCloseLoading} animation={true} dialogClassName='modal-25vw' >
       <Modal.Header closeButton>
          <Modal.Title>
          Chargement en cours...
         </Modal.Title>
        </Modal.Header>
        <Modal.Body>
           <img src="/img/loading.gif" title="Chargement"  alt="Chargement en cours" className="icone-action-25"/>
        </Modal.Body>
        <Modal.Footer>
         
        </Modal.Footer>
      </Modal>
</div>
  );
};

export default Loading;