import http from "./security/api";
 
class DashboardsDataService {
  
groupAndCountConsultationByTypeConsultationAsync = async (query) => {
    try {
      let response= await  http.get("/dashboard/soins/countActe"+query);
      return await response;
    } catch (err) {
        
        return err.response;
    }
}
groupAndCountExamenByTypeExamenAsync = async (query) => {
    try {
      let response= await  http.get("/dashboard/examens/countActe"+query);
      return await response;
    } catch (err) {
        
        return err.response;
    }
}

groupAndSejourByUniteAsync = async (query) => {
    try {
      let response= await  http.get("/dashboard/sejours/countUnite"+query);
      return await response;
    } catch (err) {
        
        return err.response;
    }
}

countConsultationEvolutionByTypeConsultationAsync = async (query) => {
    try {
      let response= await  http.get("/dashboard/soins/countSoinsEvolutionByActe"+query);
      return await response;
    } catch (err) {
        
        return err.response;
    }
}
countExamenEvolutionByTypeExamenAsync = async (query) => {
    try {
      let response= await  http.get("/dashboard/examens/countExamensEvolutionByActe"+query);
      return await response;
    } catch (err) {
        
        return err.response;
    }
}



countPersonneEvolutionBySexeAsync = async (query) => {
    try {
      let response= await  http.get("/dashboard/personnes/countPersonnesEvolutionBySexe"+query);
      return await response;
    } catch (err) {
        
        return err.response;
    }
}
countHospitalisationEvolutionByUniteAsync = async (query) => {
    try {
      let response= await  http.get("/dashboard/sejours/countSejourEvolutionByUnite"+query);
      return await response;
    } catch (err) {
        
        return err.response;
    }
}

 groupAndCountByPersonneAgeAndOrSexeAsync = async (query) => {
    try {
      let response= await  http.get("/dashboard/personnes/countByAgeRange"+query);
      return await response;
    } catch (err) {
        
        return err.response;
    }
}


 sumFactureLigneAsync = async (query) => {
    try {
      let response= await  http.get("/dashboard/factureLignes/sumFactureLigne"+query);
      return await response;
    } catch (err) {
        
        return err.response;
    }
}


 constantesMedicalesByPeriode = async (query) => {
    try {
      let response= await  http.get("/dashboard/ConstantesMedicales/byPeriode"+query);
      return await response;
    } catch (err) {
        
        return err.response;
    }
   }

}

export default new DashboardsDataService();