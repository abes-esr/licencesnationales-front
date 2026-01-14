export class User {
  id: number = -999;
  token: string = "";
  siren: string = "";
  nameEtab: string = "";
  isLoggedIn: boolean = false;
  isAdmin: boolean = false;

  constructor({ id, token, siren, nameEtab, isLoggedIn, isAdmin }: User = {} as User) {
    this.id = id;
    this.token = token;
    this.siren = siren;
    this.nameEtab = nameEtab;
    this.isLoggedIn = isLoggedIn;
    this.isAdmin = isAdmin;
  }
}
export default User;
