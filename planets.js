
class Planet {
  constructor() {
    if (this.constructor === Planet) {
      throw new TypeError('Abstract class "Planet" cannot be instantiated directly.');
    }
  }

  radius() {
    return this.diameter/2.0
  }

  heliocentric_position(y, m, D, UT){
    this.d = 367*y - 7 * ( y + (m+9)/12 ) / 4 - 3 * ( ( y + (m-9)/7 ) / 100 + 1 ) / 4 + 275*m/9 + D - 730515
    this.d = this.d + UT/24.0
    this.N = this.N1 + this.N2*this.d
    this.i = this.i1 + this.i2*this.d
    this.w = this.w1 + this.w2*this.d
    this.a = this.a1 + this.a2*this.d
    this.e = this.e1 + this.e2*this.d
    this.M = this.M1 + this.M2*this.d
    let E0 = this.M + this.e * Math.sin(this.M) * ( 1.0 + this.e * Math.cos(this.M) )
    let E1 = 0
    let temp
    while(Math.abs(E0-E1)>0.001) {
      temp = E1
      E1 = E0 - ( E0 - this.e * Math.sin(E0) - this.M ) / ( 1 - this.e * Math.cos(E0) )
      E0 = temp
    }
    const E = E1
    const xv = this.a * ( Math.cos(E) - this.e )
    const yv = this.a * ( Math.sqrt(1.0 - this.e*this.e) * Math.sin(E) )
    const v = Math.atan2( yv, xv )
    const r = Math.sqrt( xv*xv + yv*yv )
    const xh = r * ( Math.cos(this.N) * Math.cos(v+this.w) - Math.sin(this.N) * Math.sin(v+this.w) * Math.cos(this.i) )
    const yh = r * ( Math.sin(this.N) * Math.cos(v+this.w) + Math.cos(this.N) * Math.sin(v+this.w) * Math.cos(this.i) )
    const zh = r * ( Math.sin(v+this.w) * Math.sin(this.i) )
    return [xh, yh, zh]
  }
}

class Earth extends Planet {
  N1 = 0.0
  N2 = 0.0
  i1 = 0.0
  i2 = 0.0
  w1 = 282.9404 
  w2 = 4.70935E-5
  a1 = 1.000000
  a2 = 0.0
  e1 = 0.016709
  e2 = 1.151E-9
  M1 = 356.0470
  M2 = 0.9856002585

  diameter = 7926
  heliocentric_position(y, m, D, UT){
    return super.heliocentric_position(y, m, D, UT).map(x => -x)
  }
}

class Mercury extends Planet {
  N1 =  48.3313
  N2 = 3.24587E-5
  i1 = 7.0047
  i2 = 5.00E-8
  w1 = 29.1241
  w2 = 1.01444E-5
  a1 = 0.387098
  a2 = 0.0
  e1 = 0.205635
  e2 = 5.59E-10
  M1 = 168.6562
  M2 = 4.0923344368

  diameter = 3031
}

class Venus extends Planet {
  N1 =  76.6799
  N2 = 2.46590E-5
  i1 = 3.3946
  i2 = 2.75E-8 
  w1 =  54.8910
  w2 = 1.38374E-5
  a1 = 0.723330
  a2 = 0.0
  e1 = 0.006773 
  e2 = - 1.302E-9
  M1 =  48.0052
  M2 = 1.6021302244

  diameter = 7521
}

class Mars extends Planet {
  N1 =  49.5574
  N2 = 2.11081E-5
  i1 = 1.8497 
  i2 = - 1.78E-8
  w1 = 286.5016
  w2 = 2.92961E-5
  a1 = 1.523688
  a2 = 0.0
  e1 = 0.093405
  e2 = 2.516E-9
  M1 = 18.6021
  M2 = 0.5240207766

  diameter = 4222 
}

class Jupiter extends Planet {
  N1 =  100.4542
  N2 = 2.76854E-5
  i1 = 1.3030
  i2 = - 1.557E-7
  w1 = 273.8777
  w2 = 1.64505E-5
  a1 = 1.523688
  a2 = 0.0
  e1 = 0.048498
  e2 = 4.469E-9
  M1 = 19.8950
  M2 = 0.0830853001

  diameter = 88729
}

class Saturn extends Planet {
  N1 =  113.6634
  N2 = 2.38980E-5
  i1 = 2.4886
  i2 = - 1.081E-7
  w1 = 339.3939
  w2 = 2.97661E-5
  a1 = 9.55475
  a2 = 0.0
  e1 = 0.055546
  e2 = - 9.499E-9
  M1 = 316.9670
  M2 = 0.0334442282

  diameter = 74600
}

class Uranus extends Planet {
  N1 =  74.0005
  N2 = 1.3978E-5
  i1 = 0.7733
  i2 = 1.9E-8
  w1 = 96.6612
  w2 = 3.0565E-5
  a1 = 19.18171
  a2 = - 1.55E-8
  e1 = 0.047318
  e2 = 7.45E-9
  M1 = 142.5905
  M2 = 0.011725806

  diameter = 32600
}

class Neptune extends Planet {
  N1 =  131.7806
  N2 = 3.0173E-5
  i1 = 1.7700
  i2 = - 2.55E-7
  w1 = 272.8461
  w2 = - 6.027E-6
  a1 = 30.05826
  a2 = 3.313E-8
  e1 = 0.008606
  e2 = 2.15E-9
  M1 = 260.2471
  M2 = 0.005995147

  diameter = 30200
}
