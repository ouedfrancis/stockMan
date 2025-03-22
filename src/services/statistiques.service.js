import http from "./security/api";
 
class StatistiquesDataService {
  getAll() {
    return http.get("/statistiques");
  }
getAllAsync = async (data) => {
    try {
      let response= await  http.get("/statistiques");
      return await response;
    } catch (err) {
        
        return err.response;
    }
}

}

export default new StatistiquesDataService();