import http from "./security/api";
 
class DocumentsDataService {
/***used*******/
/* getByPatientId(id, actif) {
  if(actif==null)
    return http.get(`/patients/${id}/examens`);
  else
      return http.get(`/patients/${id}/examens?actif=${actif}`);
  }


getByPatientIdAsync = async (id, actif) => {
    try {
      let query="";
      if(actif==null)
        query=`/patients/${id}/examens`;
      else
         query=`/patients/${id}/examens?actif=${actif}`;
      // console.log(query)
      let response= await  http.get(query);
      return await response;
    } catch (err) {
        
        return err.response;
    }
}*/

createAsync = async (data) => {
    try {
     // console.log("url",`/patients/${patientId}/examen`)
      //console.log("data",data)
      let response= await  http.post(`/documents`, data);
      return await response;
    } catch (err) {
       
        return err.response;
    }
}

updateAsync = async (id, data) => {
    try {
      let response= await  http.put(`/documents/${id}`, data);
      return await response;
    } catch (err) {
        
        return err.response;
        
    }
}

findAsync = async (query) => {
    try {
         console.log("DocumentsDataService========>"+query)
      let response= await  http.get(`/documents`+query);
      return await response;
    } catch (err) {
        
        return err.response;
    }
}


deleteAsync= async (id) => {

    try {
      let response= await  http.delete(`/documents/${id}`);
      return await response;
    } catch (err) {
       
        return err.response;
    }
  }

/****************************/


}

export default new DocumentsDataService();