import http from "../security/api";
 
class AchatProduitsDataService {

getAllAsync = async (data) => {
    try {
      let response= await  http.get("/achatProduits");
      return await response;
    } catch (err) {
        
        return err.response;
    }
}

getActifAsync = async (data) => {
    try {
      let response= await  http.get("/achatProduits/actif");
      return await response;
    } catch (err) {
        
        return err.response;
    }
}

createAsync = async (data) => {
    try {
      let response= await  http.post("/achatProduits", data);
      return await response;
    } catch (err) {
       
        return err.response;
    }
}

updateAsync = async (id, data) => {
    try {
      let response= await  http.put(`/achatProduits/${id}`, data);
      return await response;
    } catch (err) {
        
        return err.response;
        
    }
}

receptionAsync = async (id, data,query) => {
    try {
      let response= await  http.put(`/achatProduits/${id}`+query, data);
      return await response;
    } catch (err) {
        
        return err.response;
        
    }
}

findAsync = async (query) => {
    try {
      let response= await  http.get("/achatProduits"+query);
      return await response;
    } catch (err) {
        
        return err.response;
    }
}
 
}

export default new AchatProduitsDataService();