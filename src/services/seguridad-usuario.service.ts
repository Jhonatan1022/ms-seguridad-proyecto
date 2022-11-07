import { /* inject, */ BindingScope, injectable, service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {CredencialesLogin} from '../models';
import {UsuarioRepository} from '../repositories';
import {JwtService} from './jwt.service';
var generator = require('generate-password');
var MD5 = require("crypto-js/md5");

@injectable({scope: BindingScope.TRANSIENT})
export class SeguridadUsuarioService {
  constructor(
    @repository(UsuarioRepository)
    private usuarioRepository: UsuarioRepository,
    @service(JwtService)
    private servicioJwt: JwtService
  ) { }


  /**
   * Metodo para autenticacion de usuarios
   * @param credenciales  credenciales de acceso
   * @returns una cadena con el token o sino cadena vacia cuando no coinciden las credenciales
   */
  async IdentificarUsuarios(credenciales: CredencialesLogin): Promise<string> {
    let respuesta = "";
    let usuario = await this.usuarioRepository.findOne(
      {
        where: {
          email: credenciales.email,
          clave: credenciales.clave
        }
      }
    );

    //creacion del token y asignacion a respuesta

    if (usuario) {
      let datos = {
        nombre: usuario.Nombre,
        email: usuario.email,
        rol: usuario.rol
      }
      try {
        respuesta = this.servicioJwt.CrearToken(datos);
      } catch (err) {
        throw err;
      }

    }

    return respuesta;
  }

  /**
   * Genera una clave aleatoria
   * @returns clave generada
   */

  CrearClaveAleatoria(): string {
    let password = generator.generate({
      lenght: 10,
      numbers: true,
      symbols: true,
      uppercase: true
    });
    return password;
  }


  CifrarCadena(cadena: string): string {
    let CadenaCifrada = MD5(cadena).toString();
    return CadenaCifrada;
  }

}
