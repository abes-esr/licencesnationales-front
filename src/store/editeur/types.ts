export interface Editeur {
    id: string;
    nom : string;
    adresse : string;
    mailsPourBatch : List<String>;
    mailsPourInformation : List<String>;

}

export interface EditeurState {
    editeur?: Editeur;
    error: boolean;
    errorMessage: string;
}


