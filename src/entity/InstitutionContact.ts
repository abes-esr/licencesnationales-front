export class InstitutionContact {
  id: number = -999;
  nom: string = "";
  prenom: string = "";
  adresse: string = "";
  boitePostale: string = "";
  codePostal: string = "";
  ville: string = "";
  cedex: string = "";
  telephone: string = "";
  mail: string = "";
  motDePasse: string = "";
  role: string = "";

  constructor({
    id,
    nom,
    prenom,
    adresse,
    boitePostale,
    codePostal,
    ville,
    cedex,
    telephone,
    mail,
    motDePasse,
    role
  }: Partial<InstitutionContact> = {}) {
    this.id = id ?? this.id;
    this.nom = nom ?? this.nom;
    this.prenom = prenom ?? this.prenom;
    this.adresse = adresse ?? this.adresse;
    this.boitePostale = boitePostale ?? this.boitePostale;
    this.codePostal = codePostal ?? this.codePostal;
    this.ville = ville ?? this.ville;
    this.cedex = cedex ?? this.cedex;
    this.telephone = telephone ?? this.telephone;
    this.mail = mail ?? this.mail;
    this.motDePasse = motDePasse ?? this.motDePasse;
    this.role = role ?? this.role;
  }

  reset(): void {
    this.nom = "";
    this.prenom = "";
    this.adresse = "";
    this.boitePostale = "";
    this.codePostal = "";
    this.ville = "";
    this.cedex = "";
    this.telephone = "";
    this.mail = "";
    this.motDePasse = "";
  }
}
export default InstitutionContact;
