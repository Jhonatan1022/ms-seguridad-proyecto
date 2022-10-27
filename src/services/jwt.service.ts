import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import {Keys} from '../config/keys';
var jwt = require('jsonwebtoken');

@injectable({scope: BindingScope.TRANSIENT})
export class JwtService {
  constructor(/* Add @inject to inject parameters */) { }

  CrearToken(info: Object): string {
    try {
      var token = jwt.sign(info, Keys.JwtSecretKey);
      return token;
    } catch (err) {
      throw err;
    }
  }
}
