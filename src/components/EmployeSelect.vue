<template lang="html">
  <v-app>
    <v-container fluid>

      <v-layout row wrap>
        <v-toolbar flat color="white">
          <v-toolbar-title>Sélection d'employés</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="search"
            label="Recherche"
            single-line
            hide-details
          ></v-text-field>
        </v-toolbar>
      </v-layout>

      <v-layout row wrap>
        <v-flex xs12>
          <v-divider horizontal></v-divider>
          <v-data-table
            v-model="selected"
            :headers="headers"
            :items="employees"
            item-key="idemploye"
            :search="search"
            :hide-actions="false"
            :select-all="false"
            class="elevation-1"
            prev-icon="mdi-menu-left"
            next-icon="mdi-menu-right"
            sort-icon="mdi-menu-down">
            <template slot="items" slot-scope="props">
              <tr :class="(props.item.isactive == '1') ? '' : 'disabled'" @click="props.expanded = !props.expanded">
                <td>
                  <v-checkbox v-show="(props.item.isactive == '1') || allowNonactiveSelectable"
                    @click.native.stop
                    v-model="props.selected"
                    :disabled="!((props.item.isactive == '1') || allowNonactiveSelectable)"
                    primary
                    hide-details
                  ></v-checkbox>
                </td>
                <td>{{props.item.nom}}</td>
                <td>{{props.item.prenom}}</td>
                <td>{{getOUPath(props.item.orgunits.OrgUnit)}}</td>
                <td>{{props.item.idemploye}}</td>
                <td>{{extractLoginNT(props.item.mainntlogin)}}</td>
                <!-- <td><v-icon class="mr-2" @click="editItem(props.item)">mdi-account-edit</v-icon></td> -->
              </tr>
            </template>
            <template slot="expand" slot-scope="props">
              <v-card flat>
                <v-card-text>
                  <span>{{props.item.politesse}}</span><br>
                  <span>{{props.item.prenom}}&nbsp;{{props.item.nom}}</span><br>
                  <span>Téléphone prof.: {{props.item.telprof}}</span><br>
                  <span>Email: {{props.item.email}}</span><br>
                </v-card-text>
              </v-card>
            </template>
            <template slot="no-data">
              <v-alert :value="true" type="info">
                Désolé, il n'y a aucun employé correspondant à votre recherche!
              </v-alert>
            </template>
          </v-data-table>
        </v-flex>
      </v-layout>

      <v-layout row wrap>
        <v-switch
          :label="'Afficher les employés désactivé: ' + (display_nonactive.toString() == 'true' ? 'oui' : 'non')"
          v-model="display_nonactive"
          :false-value="false"
          :true-value="true"
        ></v-switch>
      </v-layout>

      <v-layout row wrap justify-end>
        <v-btn color="blue darken-1" flat @click.native="cancel">Annuler</v-btn>
        <v-btn color="blue darken-1" flat @click.native="save">OK</v-btn>
      </v-layout>
    </v-container>
  </v-app>
</template>

<script>
import '../plugins/axios'

import {EMP_URL_AJAX} from '../config'

export default {
  props: {
    multi: {
      type: Boolean,
      default: true,
      require: false
    },
    allowNonactiveSelectable: {
      type: Boolean,
      default: false,
      require: false
    }
  },
  data () {
    return {
      dialog: false,
      display_nonactive: true,
      search: '',
      headers: [
        {
          text: '',
          value: '',
          align: 'left',
          sortable: false
        },
        {
          text: 'Nom',
          value: 'nom',
          align: 'left',
          sortable: true
        },
        {
          text: 'Prénom',
          value: 'prenom',
          align: 'left',
          sortable: true
        },
        {
          text: 'Unité organisationnelle',
          value: 'orgunits',
          align: 'left',
          sortable: true
        },
        {
          text: 'Id',
          value: 'idemploye',
          align: 'left',
          sortable: true
        },
        {
          text: 'Login NT',
          value: 'mainntlogin',
          align: 'left',
          sortable: true
        },
      ],
      employees: [],
      selected: [],
      fetch_url: `${EMP_URL_AJAX}/employe_get_liste.php`
    }
  },
  watch: {
    selected: {
      handler (val) {
        console.log('### employé sélectionné: ', val)
      }
    },
    display_nonactive: {
      handler (val) {
        this.fetchData()
      }
    },
    dialog (val) {
      val || this.close()
    }
  },
  methods: {
    dummy_func (msg) {
      console.log(msg)
    },
    initialize () {
      // this.employees = [{id: 10958, nom: 'Pittet', prenom: 'Maurice', active: true}, {id: 7, nom: 'Naegele', prenom: 'Christian', active: false}, {id: 6, nom: 'Gil', prenom: 'Carlos', active: true}, {id: 1, nom: 'Test1', prenom: 'Maurice', active: true}, {id: 2, nom: 'Test2', prenom: 'Christian', active: false}, {id: 3, nom: 'Test3', prenom: 'Carlos', active: true}]
    },
    click () {
      // TODO: Afficher le widget et evt. faire quelques initialisations
    },
    close () {
      // TODO: Fermer le widget
    },
    cancel () {
      // TODO: On n'affiche plus le widget
    },
    save () {
      // TODO: Emettre un événement avec en paramètre la liste des employés sélectionnés
    },
    fetchData () {
      this.$axios.post(this.fetch_url, {params: {idou: 62, prenom: '*', nom: '*'}}).then(response => {
      // this.$axios.post(this.fetch_url, {params: {loginnt: 10958}}).then(response => {
        let __display_nonactive = this.display_nonactive
        this.employees = response.data.Employe.filter(employe => (employe.IsActive === '1') || __display_nonactive)

        this.employees.forEach(function(employee) {
	        for (var prop in employee) {
		        employee[prop.toLowerCase()] = employee[prop]
		        delete employee[prop]
	        }
        })

        console.log('### response: ', response)
        console.log('### emoployees: ', this.employees)
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
    },
    extractLoginNT (mainntlogin) {
      if (/^LAUSANNE_CH/.test(mainntlogin)) {
        return mainntlogin.substring(12)
      } else {
        return mainntlogin
      }
    },
    getOUPath (orgunits)
    {
      let __myorgunits = orgunits.slice()
      __myorgunits.sort(function (a, b) {
        return parseInt(b.LevelOU) - parseInt(a.LevelOU)
      })
      let __oupath = ''
      __myorgunits.forEach(function (orgunit, index, array) {
        __oupath += orgunit.OUName + ((index+1 != array.length) ? ' / ' : '')
      })
      return __oupath
    }
  },
  created () {
    this.initialize()
    this.fetchData()
  }
}
</script>

<style lang="css" scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.disabled {
  color: grey;
}
</style>
