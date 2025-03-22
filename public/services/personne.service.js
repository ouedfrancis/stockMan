import http from "./security/api";

class PersonneDataService {
  getAll() {
    return http.get("/personnes");
  }

  get(id) {
    return http.get(`/personnes/${id}`);
  }


createAsync = async (data) => {
    try {
      let response= await  http.post("/personnes", data);
      return await response;
    } catch (err) {
        // Handle Error Here
        console.log("-----------LOG ERROR-----------personnes");
        console.error(err);
        return err.response;
    }
}

updateAsync = async (id, data) => {
    try {
      let response= await  http.put(`/personnes/${id}`, data);
      return await response;
    } catch (err) {
        // Handle Error Here
        console.log("-----------LOG ERROR-----------personnes");
        console.error(err);
        return err.response;
        
    }
}
countPersonneAsync = async (query) => {
    try {
      let response= await  http.get("/personnes/count"+query);
      return await response;
    } catch (err) {
        
        return err.response;
    }
}
existPersonneAsync = async (query) => {
    try {
      let response= await  http.get("/personnes/exist"+query);
      return await response;
    } catch (err) {
        
        return err.response;
    }
}
 /* create(data) {
    return http.post("/personnes", data);
  }

  update(id, data) {
    return http.put(`/personnes/${id}`, data);
  }

  delete(id) {
    return http.delete(`/personnes/${id}`);
  }

  deleteAll() {
    return http.delete(`/personnes`);
  }

  find(obj) {
    return http.get(`/personnes?nom=${obj.nom}&prenoms=${obj.prenoms}&dateNais=${obj.dateNais}&telMobile=${obj.telMobile}&numPatient=${obj.numPatient}&actif=${obj.actif}`);
  }


  findAsync = async (obj) => {
    try {
      let response= await  http.get(`/personnes?nom=${obj.nom}&prenoms=${obj.prenoms}&dateNais=${obj.dateNais}&telMobile=${obj.telMobile}&numPatient=${obj.numPatient}&actif=${obj.actif}`);
      return await response;
    } catch (err) {
        // Handle Error Here
        console.log("-----------LOG ERROR-----------personnes");
        console.error(err);
        return err.response;
        
    }
  }*/

findAsync = async (query) => {
    try {
      let response= await  http.get("/personnes"+query);
      return await response;
    } catch (err) {
        
        return err.response;
    }
}
}

export default new PersonneDataService();