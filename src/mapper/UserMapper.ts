import User from "@/entity/User";

export interface JsonLoginResponse {
  accessToken: string;
  tokenType: string;
  userNameEtab: string;
  isAdmin: boolean;
  userSiren: string;
  id: number;
  role: string;
}

export class UserMapper {
  static toDomain(response: JsonLoginResponse): User {
    const user = new User();
    user.id = response.id;
    user.token = response.accessToken;
    user.nameEtab = response.userNameEtab;
    user.siren = response.userSiren;
    user.isAdmin = response.role === "admin";
    user.isLoggedIn = true;
    return user;
  }
}

