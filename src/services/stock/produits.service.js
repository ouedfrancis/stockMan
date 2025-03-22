import http from "../security/api";
 
class ProduitsDataService {

getAllAsync = async (data) => {
    try {
      let response= await  http.get("/produits");
      return await response;
    } catch (err) {
        
        return err.response;
    }
}

getActifAsync = async (data) => {
    try {
      let response= await  http.get("/produits/actif");
      return await response;
    } catch (err) {
        
        return err.response;
    }
}

createAsync = async (data) => {
    try {
      let response= await  http.post("/produits", data);
      return await response;
    } catch (err) {
       
        return err.response;
    }
}

updateAsync = async (id, data) => {
    try {
      let response= await  http.put(`/produits/${id}`, data);
      return await response;
    } catch (err) {
        
        return err.response;
        
    }
}
bulkAsync = async (data,userId) => {
    try {
      let response= await  http.post("/produits/bulk?userId="+userId, data);
      return await response;
    } catch (err) {
        
        return err.response;
    }
}
findAsync = async (query) => {
    try {
        console.log("query",query)
      let response= await  http.get("/produits"+query);
      return await response;
    } catch (err) {
        
        return err.response;
    }
}
 
}

export default new ProduitsDataService();