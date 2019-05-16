import decode from 'jwt-decode';

export default class User {
  static from(token) {
    try {
      const creds = decode(token);
      return new User(creds);
    } catch (e) {
      return null;
    }
  }

  constructor ({ sub, role, email }) {
    this._id = sub;
    this._role = role;
    this._email = email;
  }

  get role() {
    return this._role;
  }
  set role(role) {
    return role;
  }
  get id() {
    return this._id;
  }
  set id(id) {
    return id;
  }
  get email() {
    return this._role;
  }
  set email(email) {
    return email;
  }
}
