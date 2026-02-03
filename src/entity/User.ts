export class User {
  id: number = -999;
  token: string = "";
  siren: string = "";
  institutionName: string = "";
  isLoggedIn: boolean = false;
  isAdmin: boolean = false;

  constructor({
    id,
    token,
    siren,
    institutionName,
    isLoggedIn,
    isAdmin
  }: User = {} as User) {
    this.id = id;
    this.token = token;
    this.siren = siren;
    this.institutionName = institutionName;
    this.isLoggedIn = isLoggedIn;
    this.isAdmin = isAdmin;
  }
}
export default User;
