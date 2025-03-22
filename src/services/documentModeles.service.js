import http from "./security/api";
 
class DocumentModelesDataService {

findAsync = async (query) => {
    try {
      console.log("DocumentModelesDataService findAsync",query)
      let response= await  http.get("/documentModeles"+query);
      return await response;
    } catch (err) {
        
        return err.response;
    }
}

createAsync = async (data) => {
    try {
      let response= await  http.post("/documentModeles", data);
      return await response;
    } catch (err) {
       
        return err.response;
    }
}

updateAsync = async (id, data) => {
    try {
      let response= await  http.put(`/documentModeles/${id}`, data);
      return await response;
    } catch (err) {
        
        return err.response;
        
    }
}

 
}

export default new DocumentModelesDataService();