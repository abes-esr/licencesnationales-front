export interface Etablissement {

    nom : string;
    adresse : string;
    siren : string;
    typeEtablissement : string;
    idAbes : string;
    mailContact : string;
    motDePasse : string;
    nomContact : string;
    prenomContact : string;
    telephoneContact : string;
    adresseContact : string;
}

export interface EtablissementState {
    etablissement?: Etablissement;
    error: boolean;
    errorMessage: string;
}