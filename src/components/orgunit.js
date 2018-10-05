import axios from 'axios'
import { ORGUNIT_URL_AJAX } from '../config'

let instance = null
/*  Singleton to retrieve orgunit
*/
class OrgUnit {
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


  getList (orgunit, callback) {
    let __fetch_url = `${ORGUNIT_URL_AJAX}/uniteorg_get_liste.php`
    axios.post(__fetch_url, {params: orgunit}).then(response => {
      let __data = response.data.OrgUnit
      // let __myorgunits = orgunits.slice()
      __data.sort(function (a, b) {
        let __nameA = a.Description.toUpperCase()
        let __nameB = b.Description.toUpperCase()
        if (__nameA < __nameB) {
          return -1;
        }
        if (__nameA > __nameB) {
          return 1;
        }
        // names must be equal
        return 0;
      })

      callback(__data)

      console.log('### ORGUNIT response: ', response)
      console.log('### ORGUNIT orgunits: ', __data)
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

export const orgunit = new OrgUnit()
