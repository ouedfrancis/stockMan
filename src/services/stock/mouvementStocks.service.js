import http from "../security/api";
 
class MouvementStocksDataService {

getAllAsync = async (data) => {
    try {
      let response= await  http.get("/mouvementStocks");
      return await response;
    } catch (err) {
        
        return err.response;
    }
}



findAsync = async (query) => {
    try {
      let response= await  http.get("/mouvementStocks"+query);
      return await response;
    } catch (err) {
        
        return err.response;
    }
}
 
}

export default new MouvementStocksDataService();