import http from "../security/api";
 
class CategorieFinancesDataService {

getAllAsync = async (data) => {
    try {
      let response= await  http.get("/categorieFinances");
      return await response;
    } catch (err) {
        // Handle Error Here
        //console.log("-----------LOG ERROR-----------categorieFinances");
        console.error(err);
        return err.response;
    }
}
tifAsync = async (data) => {
    try {
      let response= await  http.get("/categorieFinances/actif");
      return await response;
    } catch (err) {
        // Handle Error Here
        //console.log("-----------LOG ERROR-----------categorieFinances");
        console.error(err);
        return err.response;
    }
}

createAsync = async (data) => {
    try {
      let response= await  http.post("/categorieFinances", data);
      return await response;
    } catch (err) {
        // Handle Error Here
       // console.log("-----------LOG ERROR-----------categorieFinances");
        console.error(err);
        return err.response;
    }
}

updateAsync = async (id, data) => {
    try {
      let response= await  http.put(`/categorieFinances/${id}`, data);
      return await response;
    } catch (err) {
        // Handle Error Here
        //console.log("-----------LOG ERROR-----------categorieFinances");
        console.error(err);
        return err.response;
        
    }
}

findAsync = async (query) => {
    try {
      let response= await  http.get("/categorieFinances"+query);
      return await response;
    } catch (err) {
        
        return err.response;
    }
}


}

export default new CategorieFinancesDataService();