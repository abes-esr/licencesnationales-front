//import http from "../http-common";
//import authHeader from './auth-header';
import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8081/ln/ip/';



class ListeAccesService {
    getListeIp(siren) {
        let formData = new FormData();
        formData.append("siren", siren);
        return axios.get(API_URL + 'listeIpParSiren/'+ siren, { headers: authHeader() });
    }
}


export default new ListeAccesService();
