import axios from 'axios'
import { EMP_URL_AJAX } from '../config'

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
    if ((employe.nom === null) || (employe.nom == '')) {
      employe.nom = '*'
    } else if (employe.nom.slice(-1) != '*') {
      employe.nom += '*'
    }
    if ((employe.prenom === null) || (employe.prenom == '')) {
      employe.prenom = '*'
    } else if (employe.prenom.slice(-1) != '*') {
      employe.prenom += '*'
    }

    let __fetch_url = `${EMP_URL_AJAX}/employe_get_liste.php`
    console.log('### __fetch_url: ', __fetch_url)
    console.log('### employe: ', employe)
    axios.post(__fetch_url, {params: employe}).then(response => {
      let __data = response.data.Employe.filter(employe => (employe.IsActive === '1') || display_nonactive)

      __data.forEach(function(employee) {
        for (var prop in employee) {
          employee[prop.toLowerCase()] = employee[prop]
          delete employee[prop]
        }
      })
      callback(__data)

      console.log('### EMPLOYE response: ', response)
      console.log('### EMPLOYE employees: ', __data)
    }).catch(error => {
      if (error.response) {
        console.error('Error data: ', error.response.data, ' status: ', error.response.status, ' headers: ', error.response.headers)
      } else if (error.request) {
        console.error('Error request: ', error.request)
      } else {
        console.error('Error', error.message)
      }
      console.error(error.config)
    })
  }
}

export const employe = new Employe()
