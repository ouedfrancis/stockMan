import http from "./security/api";

class PaysDataService {
  getAll() {
    return http.get("/pays");
  }
getAllAsync = async (data) => {
    try {
      let response= await  http.get("/pays");
      return await response;
    } catch (err) {
        
        return err.response;
    }
}
getActif() {
    return http.get("/pays/actif");
  }
  get(id) {
    return http.get(`/pays/${id}`);
  }
getActifAsync = async (data) => {
    try {
      let response= await  http.get("/pays/actif");
      return await response;
    } catch (err) {
        
        return err.response;
    }
}

createAsync = async (data) => {
    try {
      let response= await  http.post("/pays", data);
      return await response;
    } catch (err) {
        
        return err.response;
    }
}

updateAsync = async (id, data) => {
    try {
      let response= await  http.put(`/pays/${id}`, data);
      return await response;
    } catch (err) {
        
        return err.response;
        
    }
}
bulkAsync = async (data,userId) => {
    try {
      let response= await  http.post("/pays/bulk?userId="+userId, data);
      return await response;
    } catch (err) {
        
        return err.response;
    }
}
  create(data) {
    return http.post("/pays", data);
  }

  update(id, data) {
    return http.put(`/pays/${id}`, data);
  }

  delete(id) {
    return http.delete(`/pays/${id}`);
  }

  deleteAll() {
    return http.delete(`/pays`);
  }

  find(nom,prenom,dateNais,telMobile,numPatient) {
    return http.get(`/pays?nom=${nom}&prenom=${prenom}&dateNais=${dateNais}&telMobile=${telMobile}&numPatient=${numPatient}`);
  }
}

export default new PaysDataService();