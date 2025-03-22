import http from "./security/api";
 
class VillesDataService {
  getAll() {
    return http.get("/villes");
  }
getAllAsync = async () => {
    try {
      let response= await  http.get("/villes");
      return await response;
    } catch (err) {
        // Handle Error Here
       
        return err.response;
    }
}
getActif() {
    return http.get("/villes/actif");
  }
  get(id) {
    return http.get(`/villes/${id}`);
  }
getActifAsync = async () => {
    try {
      let response= await  http.get("/villes/actif");
      return await response;
    } catch (err) {
              
        return err.response;
    }
}

createAsync = async (data) => {
    try {
      let response= await  http.post("/villes", data);
      return await response;
    } catch (err) {
        
        return err.response;
    }
}

bulkAsync = async (data,userId) => {
    try {
      let response= await  http.post("/villes/bulk?userId="+userId, data);
      return await response;
    } catch (err) {
        
        return err.response;
    }
}
updateAsync = async (id, data) => {
    try {
      let response= await  http.put(`/villes/${id}`, data);
      return await response;
    } catch (err) {
        
        return err.response;
        
    }
}


findVillActifByPaysIdAsync = async (paysId,nomVille, actif) => {
    try {
         let req=""
        if(nomVille!=null &&paysId!=null &&actif!=null)
       req="/villes?paysId="+paysId+"&nomVille="+nomVille+"&actif="+actif
        else
          if(nomVille==null &&paysId!=null &&actif!=null)
              req="/villes?paysId="+paysId+"&actif="+actif
          else
             if(nomVille!=null &&actif!=null)
              req="/villes?nomVille="+nomVille+"&actif="+actif
                else
                      req="/villes?actif="+actif

      let response= await  http.get(req);
      return await response;
    } catch (err) {
              
        return err.response;
    }
}

findLiteAsync = async (query) => {
    try {
        
        let req="/villes/lite"+query

      let response= await  http.get(req);
      return await response;
    } catch (err) {
              
        return err.response;
    }
}


  create(data) {
    return http.post("/villes", data);
  }

  update(id, data) {
    return http.put(`/villes/${id}`, data);
  }

  delete(id) {
    return http.delete(`/villes/${id}`);
  }

  deleteAll() {
    return http.delete(`/villes`);
  }

}

export default new VillesDataService();