export interface JwtClaims {
  sub: string;
  rol: string;
  /** Identificador de sesión: solo una vigente por usuario. */
  sid: string;
  adminRol?: string;
}
