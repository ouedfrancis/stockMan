import http from "../security/api";
 
class LotsDataService {

getAllAsync = async (data) => {
    try {
      let response= await  http.get("/lots");
      return await response;
    } catch (err) {
        
        return err.response;
    }
}

getActifAsync = async (data) => {
    try {
      let response= await  http.get("/lots/actif");
      return await response;
    } catch (err) {
        
        return err.response;
    }
}

createAsync = async (data) => {
    try {
      let response= await  http.post("/lots", data);
      return await response;
    } catch (err) {
       
        return err.response;
    }
}

updateAsync = async (id, data) => {
    try {
      let response= await  http.put(`/lots/${id}`, data);
      return await response;
    } catch (err) {
        
        return err.response;
        
    }
}

inOutAsync = async (id, data,query) => {
    try {
      let response= await  http.put(`/entrepotProduits/${id}/inOut`+query, data);
      return await response;
    } catch (err) {
        
        return err.response;
        
    }
}
transfertProduitAsync = async (id, data,query) => {
    try {
      let response= await  http.put(`/entrepotProduits/${id}/transfertProduit`+query, data);
      return await response;
    } catch (err) {
        
        return err.response;
        
    }
}
findAsync = async (query) => {
    try {
      let response= await  http.get("/lots"+query);
      return await response;
    } catch (err) {
        
        return err.response;
    }
}
 
}

export default new LotsDataService();