import http from "./security/api";

class PersonnelsDataService {
  /*getAll() {
    return http.get("/personnels");
  }

  get(id) {
    return http.get(`/personnels/${id}`);
  }*/

getAsync = async (id) => {
  try {
      let response= await  http.get(`/personnels/${id}`);
      return await response;
  } catch (err) {
        // Handle Error Here
        console.log("-----------LOG ERROR-----------personnels");
        console.error(err);
        return err.response;
    }
}

getAllAsync = async () => {
    try {
      let response= await  http.get("/personnels");
      return await response;
    } catch (err) {
        // Handle Error Here
        console.log("-----------LOG ERROR-----------personnels");
        console.error(err);
        return err.response;
    }
}
getAllActifAsync = async (actif) => {
    try {
      let response= await  http.get("/personnels?actif="+actif);
      return await response;
    } catch (err) {
        // Handle Error Here
        console.log("-----------LOG ERROR-----------personnels");
        console.error(err);
        return err.response;
    }
}
getByHonorairePsAsync = async (query) => {
    try {
      let response= await  http.get("/personnels/lite?"+query);
      return await response;
    } catch (err) {
      
        return err.response;
    }
}

getByPersonnelsLiteAsync = async (query) => {
    try {
      let response= await  http.get("/personnels/lite?"+query);
      return await response;
    } catch (err) {
      
        return err.response;
    }
}

getByQueryAsync = async (query) => {
    try {
      let response= await  http.get("/personnels?"+query);
      return await response;
    } catch (err) {
      
        return err.response;
    }
}


createAsync = async (data) => {
    try {
      let response= await  http.post("/personnels", data);
      return await response;
    } catch (err) {
        // Handle Error Here
        console.log("-----------LOG ERROR-----------personnels");
        console.error(err);
        return err.response;
    }
}
 bulkAsync = async (data,userId) => {
    try {
      let response= await  http.post("/personnels/bulk?userId="+userId, data);
      return await response;
    } catch (err) {
        
        return err.response;
    }
}
updateAsync = async (id, data) => {
    try {
      let response= await  http.put(`/personnels/${id}`, data);
      return await response;
    } catch (err) {
        // Handle Error Here
        console.log("-----------LOG ERROR-----------personnels");
        console.error(err);
        return err.response;
        
    }
}

updateStatutAsync = async (id, data) => {
  let query=`/personnels/statut/${id}`;
    try {
      let response= await  http.put(query, data);
      return await response;
    } catch (err) {
     
        return err.response;
        
    }
}
  findPersonnelByIdAsync = async (personnelId, actif) => {
    try {
      let query=`/personnels/${personnelId}`
      if(actif!=null)
      query=query+`?actif=${actif}`
      let response= await  http.get(query);
      return await response;
    } catch (err) {
        // Handle Error Here
        console.log("-----------LOG ERROR-----------personnels");
        console.error(err);
        return err.response;
        
    }
}

  findPersonnelByPersonneIdAsync = async (personneId, actif) => {
    try {
      let query=`/personnels/personnes/${personneId}`
      if(actif!=null)
      query=query+`?actif=${actif}`
      let response= await  http.get(query);
      return await response;
    } catch (err) {
        // Handle Error Here
        console.log("-----------LOG ERROR-----------personnels");
        console.error(err);
        return err.response;
        
    }
}

findAsync = async (query) => {
    try {
     // console.log("MessagesDataService findAsync",query)
      let response= await  http.get("/personnels"+query);
      return await response;
    } catch (err) {
        
        return err.response;
    }
}

/*
  create(data) {
    return http.post("/personnels", data);
  }

  update(id, data) {
    return http.put(`/personnels/${id}`, data);
  }


  findPersonnelByPersonneIdAsync = async (personneId, actif) => {
    try {
      let response= await  http.get(`/personnels/personnes/${personneId}?actif=${actif}`);
      return await response;
    } catch (err) {
        // Handle Error Here
        console.log("-----------LOG ERROR-----------");
        console.error(err);
        return err.response;
        
    }
}

  delete(id) {
    return http.delete(`/personnels/${id}`);
  }

  deleteAll() {
    return http.delete(`/personnels`);
  }

  find(nom,prenom,dateNais,telMobile,numPatient) {
    return http.get(`/personnels?nom=${nom}&prenom=${prenom}&dateNais=${dateNais}&telMobile=${telMobile}&numPatient=${numPatient}`);
  }*/
}

export default new PersonnelsDataService();