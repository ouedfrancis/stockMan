import http from "./security/api";
 
class MedicamentsDataService {
  getAll() {
    return http.get("/medicaments");
  }
getAllAsync = async (data) => {
    try {
      let response= await  http.get("/medicaments");
      return await response;
    } catch (err) {
      
        return err.response;
    }
}
getByQueryAsync = async (query) => {
    try {
      let response= await  http.get("/medicaments?"+query);
      return await response;
    } catch (err) {
      
        return err.response;
    }
}


getModelesAsync = async () => {
    try {
      let response= await  http.get("/medicaments/modele");
      return await response;
    } catch (err) {
      
        return err.response;
    }
}

getMarquesAsync = async () => {
    try {
      let response= await  http.get("/medicaments/marque");
      return await response;
    } catch (err) {
      
        return err.response;
    }
}

getActif() {
    return http.get("/medicaments/actif");
  }
  get(id) {
    return http.get(`/medicaments/${id}`);
  }
getActifAsync = async (data) => {
    try {
      let response= await  http.get("/medicaments/actif");
      return await response;
    } catch (err) {
       
        return err.response;
    }
}

createAsync = async (data) => {
    try {
      let response= await  http.post("/medicaments", data);
      return await response;
    } catch (err) {
        
        return err.response;
    }
}

updateAsync = async (id, data) => {
    try {
      let response= await  http.put(`/medicaments/${id}`, data);
      return await response;
    } catch (err) {
        
        return err.response;
        
    }
}
bulkAsync = async (data,userId) => {
    try {
      let response= await  http.post("/medicaments/bulk?userId="+userId, data);
      return await response;
    } catch (err) {
        
        return err.response;
    }
}

  create(data) {
    return http.post("/medicaments", data);
  }

  update(id, data) {
    return http.put(`/medicaments/${id}`, data);
  }

  delete(id) {
    return http.delete(`/medicaments/${id}`);
  }

  deleteAll() {
    return http.delete(`/medicaments`);
  }

  find(nom,prenom,dateNais,telMobile,numPatient) {
    return http.get(`/medicaments?nom=${nom}&prenom=${prenom}&dateNais=${dateNais}&telMobile=${telMobile}&numPatient=${numPatient}`);
  }
}

export default new MedicamentsDataService();