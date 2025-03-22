import http from "../security/api";
 
class PharmaciesDataService {

getAllAsync = async (data) => {
    try {
      let response= await  http.get("/pharmacies");
      return await response;
    } catch (err) {
        // Handle Error Here
       
        return err.response;
    }
}

getActifAsync = async (data) => {
    try {
      let response= await  http.get("/pharmacies/actif");
      return await response;
    } catch (err) {
              
        return err.response;
    }
}
getAsync = async (id) => {
    try {
      let response= await  http.get(`/pharmacies/${id}`);
      return await response;
    } catch (err) {
        
        return err.response;
    }
}

findAsync = async (query) => {
    try {
      let response= await  http.get("/pharmacies"+query);
      return await response;
    } catch (err) {
        
        return err.response;
    }
}

createAsync = async (data) => {
    try {
      let response= await  http.post("/pharmacies", data);
      return await response;
    } catch (err) {
        
        return err.response;
    }
}

updateAsync = async (id, data) => {
    try {
      let response= await  http.put(`/pharmacies/${id}`, data);
      return await response;
    } catch (err) {
        
        return err.response;
        
    }
}

  
}

export default new PharmaciesDataService();