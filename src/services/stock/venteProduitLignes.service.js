import http from "../security/api";
 
class VenteProduitLignesDataService {

getAllAsync = async (data) => {
    try {
      let response= await  http.get("/venteProduitLignes");
      return await response;
    } catch (err) {
        // Handle Error Here
       
        return err.response;
    }
}

getActifAsync = async (data) => {
    try {
      let response= await  http.get("/venteProduitLignes/actif");
      return await response;
    } catch (err) {
              
        return err.response;
    }
}
getAsync = async (id) => {
    try {
      let response= await  http.get(`/venteProduitLignes/${id}`);
      return await response;
    } catch (err) {
        
        return err.response;
    }
}

findAsync = async (query) => {
    try {
      let response= await  http.get("/venteProduitLignes"+query);
      return await response;
    } catch (err) {
        
        return err.response;
    }
}

createAsync = async (data) => {
    try {
      let response= await  http.post("/venteProduitLignes", data);
      return await response;
    } catch (err) {
        
        return err.response;
    }
}

updateAsync = async (id, data) => {
    try {
      let response= await  http.put(`/venteProduitLignes/${id}`, data);
      return await response;
    } catch (err) {
        
        return err.response;
        
    }
}

  
}

export default new VenteProduitLignesDataService();