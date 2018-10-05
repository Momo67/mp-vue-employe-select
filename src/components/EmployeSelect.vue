<template lang="html">
  <v-app>

    <v-container fluid>
      <v-layout row wrap>
        <v-toolbar flat color="white">
          <v-toolbar-title>Sélection d'employés</v-toolbar-title>
        </v-toolbar>
      </v-layout>

      <v-layout row wrap>
        <v-flex xs12>
          <v-divider horizontal></v-divider>
          <v-card>
            <v-card-title></v-card-title>
            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs4>
                    <!-- <v-text-field v-model="employee.idou" label="Unité organisationnelle"></v-text-field> -->
                    <v-select
                      v-model="employee.idou"
                      :items="orgunits"
                      item-text="Description"
                      item-value="IdOrgUnit"
                      label="Unité organisationnelle"
                      search-input
                    ></v-select>
                  </v-flex>
                  <v-flex xs4>
                    <v-text-field v-model="employee.nom" label="Nom"></v-text-field>
                  </v-flex>
                  <v-flex xs4>
                    <v-text-field v-model="employee.prenom" label="Prénom"></v-text-field>
                  </v-flex>
                  <v-flex xs4>
                    <v-text-field v-model="employee.loginnt" label="Login NT"></v-text-field>
                  </v-flex>
                  <v-flex xs4>
                    <v-text-field v-model="employee.id" label="Id"></v-text-field>
                  </v-flex>
                  <v-flex xs12>
                    <v-switch
                      :label="'Afficher les employés désactivé: ' + (display_nonactive.toString() == 'true' ? 'oui' : 'non')"
                      v-model="display_nonactive"
                      :false-value="false"
                      :true-value="true"
                    ></v-switch>
                  </v-flex>
                </v-layout>
              </v-container>
              <v-layout wrap>
                <v-flex xs12>
                  <v-alert
                    v-model="alert"
                    dismissible
                    type="warning"
                    icon="error"
                  >
                    {{alert_msg}}
                  </v-alert>
                </v-flex>
              </v-layout>
            </v-card-text>
            <v-card-actions>
              <v-layout wrap>
                <v-flex xs2 offset-xs10>
                  <v-btn color="blue darken-1" flat @click.native="fetchData">Rechercher</v-btn>
                </v-flex>
              </v-layout>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>

      <v-layout row wrap>
        <v-flex xs12>
          <v-divider horizontal></v-divider>
          <v-card>
            <v-card-title>
              <v-spacer></v-spacer>
              <v-layout wrap>
                <v-flex xs4 offset-xs8>
                  <v-text-field
                    v-model="search"
                    append-icon="search"
                    label="Recherche..."
                    single-line
                    hide-details
                  ></v-text-field>
                </v-flex>
              </v-layout>
            </v-card-title>
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
          </v-card>
        </v-flex>
      </v-layout>

      <v-layout row wrap>
        <v-flex xs2 offset-xs10>
          <v-btn color="blue darken-1" flat @click.native="cancel">Annuler</v-btn>
          <v-btn color="blue darken-1" flat @click.native="save">OK</v-btn>
        </v-flex>
      </v-layout>
    </v-container>
  </v-app>
</template>

<script>
//import '../plugins/axios'

import { EMPLOYEE_INIT } from '../config'
import { ORGUNIT_INIT } from '../config'
import { employe as EMPLOYE } from './employe'
import { orgunit as ORGUNIT } from './orgunit'

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
      alert: false,
      alert_msg: '',
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
      employee: {
        nom: null,
        prenom: null,
        loginnt: null,
        id: null,
        idou: null
      },
      employees: [],
      selected: [],
      orgunit: undefined,
      orgunits: []
    }
  },
  watch: {
    selected: {
      handler (val) {
        console.log('### employé sélectionné: ', val)
      }
    },
    display_nonactive: {
      handler () {
        this.fetchData()
      }
    },
    'employee.idou': {
      handler (val) {
        console.log('### idou: ', val)
      },
      deep: true
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
      this.employee = Object.assign({}, EMPLOYEE_INIT)
      this.orgunit = Object.assign({}, ORGUNIT_INIT)
      this.getOUList()
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
      if (this.isEqual(this.employee, EMPLOYEE_INIT)) {
        this.alert_msg = 'Vous devez entrer au moins un critère!'
        this.alert = true
        return
      } else {
        EMPLOYE.getList (this.employee, this.display_nonactive, (data) => {
          this.employees = data
        })
      }
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
      if (orgunits !== undefined) {
        if (Array.isArray(orgunits)) {
          let __myorgunits = orgunits.slice()
          __myorgunits.sort(function (a, b) {
            return parseInt(b.LevelOU) - parseInt(a.LevelOU)
          })
          let __oupath = ''
          __myorgunits.forEach(function (orgunit, index, array) {
            __oupath += orgunit.OUName + ((index+1 != array.length) ? ' / ' : '')
          })
          return __oupath
        } else {
          return orgunits.OUName
        }
      } else {
        return ''
      }
    },
    getOUList() {
      ORGUNIT.getList (this.orgunit, (data) => {
        this.orgunits = data
      })
    },
    isEqual (obj1, obj2) {
      let __isequal = true
      Object.keys(obj1).forEach(function (key) {
        if (obj2[key] !== obj1[key]) {
          return __isequal = false
        }
      })
      return __isequal
    }
  },
  created () {
    this.initialize()
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
