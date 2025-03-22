import http from "../security/api";
 
class VenteProduitsDataService {

getAllAsync = async (data) => {
    try {
      let response= await  http.get("/venteProduits");
      return await response;
    } catch (err) {
        // Handle Error Here
       
        return err.response;
    }
}

getActifAsync = async (data) => {
    try {
      let response= await  http.get("/venteProduits/actif");
      return await response;
    } catch (err) {
              
        return err.response;
    }
}
getAsync = async (id) => {
    try {
      let response= await  http.get(`/venteProduits/${id}`);
      return await response;
    } catch (err) {
        
        return err.response;
    }
}

findAsync = async (query) => {
    try {
      let response= await  http.get("/venteProduits"+query);
      return await response;
    } catch (err) {
        
        return err.response;
    }
}

createAsync = async (data) => {
    try {
      let response= await  http.post("/venteProduits", data);
      return await response;
    } catch (err) {
        
        return err.response;
    }
}

updateAsync = async (id, data) => {
    try {
      let response= await  http.put(`/venteProduits/${id}`, data);
      return await response;
    } catch (err) {
        
        return err.response;
        
    }
}

  
}

export default new VenteProduitsDataService();