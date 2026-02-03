export class InstitutionContact {
  id: number = -999;
  lastName: string = "";
  firstName: string = "";
  address: string = "";
  poBox: string = "";
  postalCode: string = "";
  city: string = "";
  cedex: string = "";
  phone: string = "";
  email: string = "";
  password: string = "";
  role: string = "";

  constructor({
    id,
    lastName,
    firstName,
    address,
    poBox,
    postalCode,
    city,
    cedex,
    phone,
    email,
    password,
    role
  }: Partial<InstitutionContact> = {}) {
    this.id = id ?? this.id;
    this.lastName = lastName ?? this.lastName;
    this.firstName = firstName ?? this.firstName;
    this.address = address ?? this.address;
    this.poBox = poBox ?? this.poBox;
    this.postalCode = postalCode ?? this.postalCode;
    this.city = city ?? this.city;
    this.cedex = cedex ?? this.cedex;
    this.phone = phone ?? this.phone;
    this.email = email ?? this.email;
    this.password = password ?? this.password;
    this.role = role ?? this.role;
  }

  reset(): void {
    this.lastName = "";
    this.firstName = "";
    this.address = "";
    this.poBox = "";
    this.postalCode = "";
    this.city = "";
    this.cedex = "";
    this.phone = "";
    this.email = "";
    this.password = "";
  }
}
export default InstitutionContact;
