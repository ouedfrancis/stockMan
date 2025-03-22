import http from "./security/api";
 
class EntrepriseDataService {
  getAll() {
    return http.get("/entreprises");
  }

getAllAsync = async () => {
    try {
      let response= await  http.get("/entreprise");
      return await response;
    } catch (err) {
        // Handle Error Here
       
        return err.response;
    }
}
getEntrepriseInfo() {
    return http.get("/entreprise/first");
  }


getEntrepriseInfoAsync = async () => {
    try {
      let response= await  http.get("/entreprise/first");
      return await response;
    } catch (err) {
        // Handle Error Here
       
        return err.response;
    }
}

getMacVersionAsync = async () => {
    try {
      let response= await  http.get("/entreprise/licence/infraInfo");
      return await response;
    } catch (err) {
        // Handle Error Here
       
        return err.response;
    }
}
checkLicenceAsync = async () => {
    try {
      let response= await  http.get("/entreprise/licence/check");
      return await response;
    } catch (err) {
        // Handle Error Here
       
        return err.response;
    }
}

checkLicence() {
    return http.get("/entreprise/licence/check");
  }


checkLicence() {
    return http.get("/entreprise/licence/check");
  }


decryptAndValidateAsync = async (licenceKey) => {
    try {
      let response= await  http.post("/entreprise/licence/decryptAndValidate", licenceKey);
      return await response;
    } catch (err) {
        
        return err.response;
    }
}
createAsync = async (data) => {
    try {
      let response= await  http.post("/entreprise", data);
      return await response;
    } catch (err) {
        
        return err.response;
    }
}

updateAsync = async (id, data) => {
    try {
      let response= await  http.put(`/entreprise/${id}`, data);
      return await response;
    } catch (err) {
        
        return err.response;
        
    }
}

getActif() {
    return http.get("/entreprise/actif");
  }

  get(id) {
    return http.get(`/entreprises/${id}`);
  }
getActifAsync = async (data) => {
    try {
      let response= await  http.get("/entreprise/actif");
      return await response;
    } catch (err) {
              
        return err.response;
    }
}
  create(data) {
    return http.post("/entreprise", data);
  }

  update(id, data) {
    return http.put(`/entreprises/${id}`, data);
  }

  delete(id) {
    return http.delete(`/entreprise/${id}`);
  }

  deleteAll() {
    return http.delete(`/entreprise`);
  }

  find(nom,prenom,dateNais,telMobile,numPatient) {
    return http.get(`/entreprises?nom=${nom}&prenom=${prenom}&dateNais=${dateNais}&telMobile=${telMobile}&numPatient=${numPatient}`);
  }
}

export default new EntrepriseDataService();