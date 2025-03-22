import http from "./security/api";

class PieceIdentiteDataService {
  getAll() {
    return http.get("/pieceIdentites");
  }

  get(id) {
    return http.get(`/pieceIdentites/${id}`);
  }


createAsync = async (data) => {
    try {
	    let response= await  http.post("/pieceIdentites", data);
	    return response;
    } catch (err) {
        // Handle Error Here
        console.error(err);
        return err.response;
    }
};


  create(data) {
    return http.post("/pieceIdentites", data);
  }


updateAsync = async (id,data) => {
    try {
	    let response= await  http.put(`/pieceIdentites/${id}`, data);
	    return response;
    } catch (err) {
        // Handle Error Here
        console.error(err);
        return err.response;
    }
};

  update(id, data) {
    return http.put(`/pieceIdentites/${id}`, data);
  }



  delete(id) {
    return http.delete(`/pieceIdentites/${id}`);
  }

  deleteAll() {
    return http.delete(`/pieceIdentites`);
  }

  find(nom,prenom,dateNais,telMobile,numPatient) {
    return http.get(`/pieceIdentites?nom=${nom}&prenom=${prenom}&dateNais=${dateNais}&telMobile=${telMobile}&numPatient=${numPatient}`);
  }
}

export default new PieceIdentiteDataService();