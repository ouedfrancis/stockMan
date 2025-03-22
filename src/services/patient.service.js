import http from "./security/api";

class PatientDataService {
  getAll() {
    return http.get("/patients");
  }

  get(id) {
    return http.get(`/patients/${id}`);
  }

getAsync = async (id) => {
    try {
      let response= await  http.get(`/patients/${id}`);
      return await response;
    } catch (err) {
        // Handle Error Here
        console.log("-----------LOG ERROR-----------patients");
        console.error(err);
        return await err.response;
    }
}

getAllAsync = async () => {
    try {
      let response= await  http.get("/patients");
      return await response;
    } catch (err) {
        // Handle Error Here
        console.log("-----------LOG ERROR-----------patients");
        console.error(err);
        return err.response;
    }
}

getByQueryAsync = async (query) => {
    try {
      let response= await  http.get("/patients?"+query);
      return await response;
    } catch (err) {
      
        return err.response;
    }
}

getAllActifAsync = async () => {
    try {
      let response= await  http.get("/patients/actif");
      return await response;
    } catch (err) {
        // Handle Error Here
        console.log("-----------LOG ERROR-----------patients");
        console.error(err);
        return err.response;
    }
}
getByPatientsLite = async (q) => {
    try {
      let response= await  http.get("/patients/lite?"+q);
      return await response;
    } catch (err) {
        // Handle Error Here
        console.log("-----------LOG ERROR-----------patients");
        console.error(err);
        return err.response;
    }
}
createAsync = async (data) => {
    try {
      let response= await  http.post("/patients", data);
      return await response;
    } catch (err) {
        // Handle Error Here
        console.log("-----------LOG ERROR-----------patients");
        console.error(err);
        return err.response;
    }
}

updateAsync = async (id, data) => {
    try {
      let response= await  http.put(`/patients/${id}`, data);
      return await response;
    } catch (err) {
        // Handle Error Here
        console.log("-----------LOG ERROR-----------patients");
        console.error(err);
        return err.response;
        
    }
}

 bulkAsync = async (data,userId) => {
    try {
      let response= await  http.post("/patients/bulk?userId="+userId, data);
      return await response;
    } catch (err) {
        
        return err.response;
    }
}

  findPatientByIdAsync = async (patientId, actif) => {
    try {
      let query=`/patients/${patientId}`
      if(actif!=null)
      query=query+`?actif=${actif}`
      let response= await  http.get(query);
      return await response;
    } catch (err) {
        // Handle Error Here
        console.log("-----------LOG ERROR-----------patients");
        console.error(err);
        return err.response;
        
    }
}
  findBypersonneIdAsync = async (personneId, actif) => {

    //console.log("personneId",personneId)
    try {

         let query="";
      if(actif!=null)
        query=`/patients/personnes/${personneId}?actif=${actif}`
      else
        query= `/patients/personnes/${personneId}`
    
      let response= await  http.get(query);
      return await response;
    } catch (err) {
        // Handle Error Here
        console.log("-----------LOG ERROR-----------patients");
        console.error(err);
        return err.response;
        
    }
  }


  
}

export default new PatientDataService();