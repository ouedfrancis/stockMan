import http from "../security/api";
 
class CategorieProduitsDataService {

getAllAsync = async (data) => {
    try {
      let response= await  http.get("/categorieProduits");
      return await response;
    } catch (err) {
        
        return err.response;
    }
}

getActifAsync = async (data) => {
    try {
      let response= await  http.get("/categorieProduits/actif");
      return await response;
    } catch (err) {
        
        return err.response;
    }
}

createAsync = async (data) => {
    try {
      let response= await  http.post("/categorieProduits", data);
      return await response;
    } catch (err) {
       
        return err.response;
    }
}

updateAsync = async (id, data) => {
    try {
      let response= await  http.put(`/categorieProduits/${id}`, data);
      return await response;
    } catch (err) {
        
        return err.response;
        
    }
}

findAsync = async (query) => {
    try {
      let response= await  http.get("/categorieProduits"+query);
      return await response;
    } catch (err) {
        
        return err.response;
    }
}
 
}

export default new CategorieProduitsDataService();