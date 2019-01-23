import axios from 'axios'
import { DEV, EMP_URL_AJAX } from '../config'
import Log from 'cgil-log'

const MODULE_NAME = 'employe.js'
const log = (DEV) ? new Log(MODULE_NAME, 4) : new Log(MODULE_NAME, 2)

let instance = null
/*  Singleton to retrieve employe
*/
class Employe {
  constructor() {
    if (!instance) {
      instance = this
    }
    // to test whether we have singleton or not and store how old is data
    this.time = new Date()
    this.data = []
    this.isReady = false
    return instance
  }


  getList (employe, display_nonactive, callback) {
    if (employe.idou == null) {
      employe.idou = 0
    }
    if ((employe.nom === null) || (employe.nom === undefined) || (employe.nom == '')) {
      employe.nom = '*'
    } else if (employe.nom.slice(-1) != '*') {
      employe.nom += '*'
    }
    if ((employe.prenom === null) || (employe.prenom === undefined) || (employe.prenom == '')) {
      employe.prenom = '*'
    } else if (employe.prenom.slice(-1) != '*') {
      employe.prenom += '*'
    }

    let __fetch_url = `${EMP_URL_AJAX}/employe_get_liste.php`
    axios.post(__fetch_url, {params: employe}).then(response => {
      let __data = response.data.Employe.filter(employe => (employe.IsActive === '1') || display_nonactive)

      __data.forEach(function(employee) {
        for (var prop in employee) {
          employee[prop.toLowerCase()] = employee[prop]
          if (typeof employee['prenom'] === 'object')
            employee['prenom'] = ''
          delete employee[prop]
        }
      })
      callback(__data)

      log.l('## in Employe::getList employees: ', __data)
    }).catch(error => {
      if (error.response) {
        log.e(`## in Employe::getList Error data: ${error.response.data}, status: ${error.response.status}, headers: ${error.response.headers}`)
      } else if (error.request) {
        log.e(`## in Employe::getList Error request: ${error.request}`)
      } else {
        log.e(`## in Employe::getList Error: ${error.message}`)
      }
      log.e(`## in Employe::getList Error: ${error.config}`)
    })
  }
}

export const employe = new Employe()
