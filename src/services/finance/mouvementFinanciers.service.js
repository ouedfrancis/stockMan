import http from "../security/api";
 
class MouvementFinanciersDataService {

getAllAsync = async (data) => {
    try {
      let response= await  http.get("/mouvementFinanciers");
      return await response;
    } catch (err) {
        // Handle Error Here
       //console.log("-----------LOG ERROR-----------mouvementFinanciers");
        console.error(err);
        return err.response;
    }
}

getActifAsync = async (data) => {
    try {
      let response= await  http.get("/mouvementFinanciers/actif");
      return await response;
    } catch (err) {
        // Handle Error Here
        //console.log("-----------LOG ERROR-----------mouvementFinanciers");
        console.error(err);
        return err.response;
    }
}

createAsync = async (data) => {
    try {
      let response= await  http.post("/mouvementFinanciers", data);
      return await response;
    } catch (err) {
        // Handle Error Here
        //console.log("-----------LOG ERROR-----------mouvementFinanciers");
        console.error(err);
        return err.response;
    }
}

updateAsync = async (id, data) => {
    try {
      let response= await  http.put(`/mouvementFinanciers/${id}`, data);
      return await response;
    } catch (err) {
        // Handle Error Here
        //console.log("-----------LOG ERROR-----------mouvementFinanciers");
        console.error(err);
        return err.response;
        
    }
}

findAsync = async (query) => {
    try {
      let response= await  http.get("/mouvementFinanciers"+query);
      return await response;
    } catch (err) {
        
        return err.response;
    }
}

}

export default new MouvementFinanciersDataService();