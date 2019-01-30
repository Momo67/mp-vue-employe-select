export const DEV = process.env.NODE_ENV === 'development'
export const EMP_URL_AJAX = DEV ? 'http://mygolux.lausanne.ch/goeland/employe/ajax' : 'http://localhost/goeland/employe/ajax'
export const ORGUNIT_URL_AJAX = DEV ? 'http://mygolux.lausanne.ch/goeland/uniteorg/ajax' : 'http://localhost/goeland/uniteorg/ajax'
export const EMPLOYEE_INIT = {
  nom: null,
  prenom: null,
  loginnt: null,
  id: null,
  idou: null
}
export const ORGUNIT_INIT = {
  isactive: 1
}
