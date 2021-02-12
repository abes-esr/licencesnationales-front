import http from "../http-commons";

class AccesDataService {
    getAll() {
        return http.get("/acces");
    }

    get(id) {
        return http.get(`/acces/${id}`);
    }

    create(data) {
        return http.post("/acces", data);
    }

    update(id, data) {
        return http.put(`/acces/${id}`, data);
    }

    delete(id) {
        return http.delete(`/acces/${id}`);
    }

    deleteAll() {
        return http.delete(`/acces`);
    }

    findByValeur(valeur) {
        return http.get(`/acces?valeur=${valeur}`);
    }
}

export default new AccesDataService();
