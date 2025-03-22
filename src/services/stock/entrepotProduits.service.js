import http from "../security/api";
 
class EntrepotProduitsDataService {

getAllAsync = async (data) => {
    try {
      let response= await  http.get("/entrepotProduits");
      return await response;
    } catch (err) {
        
        return err.response;
    }
}

getActifAsync = async (data) => {
    try {
      let response= await  http.get("/entrepotProduits/actif");
      return await response;
    } catch (err) {
        
        return err.response;
    }
}

createAsync = async (data) => {
    try {
      let response= await  http.post("/entrepotProduits", data);
      return await response;
    } catch (err) {
       
        return err.response;
    }
}

updateAsync = async (id, data) => {
    try {
      let response= await  http.put(`/entrepotProduits/${id}`, data);
      return await response;
    } catch (err) {
        
        return err.response;
        
    }
}

findAsync = async (query) => {
    try {
      let response= await  http.get("/entrepotProduits"+query);
      return await response;
    } catch (err) {
        
        return err.response;
    }
}
 
}

export default new EntrepotProduitsDataService();