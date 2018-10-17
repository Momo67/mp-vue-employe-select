<template>
  <div id="app">
    <v-app class="app">
    <v-dialog v-model="dialog">
      <template slot="activator">
        <slot>
          Cliquer ici!
        </slot>
      </template>
      <v-card>
        <v-card-title>
          <span class="headline">Sélection d'employé</span>
        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn icon @click="clear">
            <v-tooltip bottom>
              <span slot="activator">
                <v-icon>clear</v-icon>
              </span>
              <span>
                Cliquer pour réinitialiser
              </span>
            </v-tooltip>
          </v-btn>
        </v-card-actions>
        <v-card-text>
          <v-container grid-list-md>
            <v-form ref="form">
              <v-layout wrap>
                <v-flex xs12>
                  <v-autocomplete
                    v-model="employee.idou"
                    :items="orgunits"
                    color="primary"
                    hide-no-data
                    clearable
                    item-text="Description"
                    item-value="IdOrgUnit"
                    label="Unité organisationnelle"
                    placeholder="Entrer un caractère pour commencer la recherche"
                  ></v-autocomplete>
                </v-flex>
                <v-flex xs12 sm6 md6>
                  <v-text-field v-model="employee.nom" label="Nom" clearable :rules="[rules.nomprenom]"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md6>
                  <v-text-field v-model="employee.prenom" label="Prénom" clearable :rules="[rules.nomprenom]"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md6>
                  <v-text-field v-model="employee.loginnt" label="Login NT" clearable :rules="[rules.loginnt]"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md6>
                  <v-text-field v-model="employee.id" label="Id" clearable :rules="[rules.id]"></v-text-field>
                </v-flex>
              </v-layout>
            </v-form>
            <v-flex xs12>
              <v-switch
                :label="'Afficher les employés désactivé: ' + (display_nonactive.toString() == 'true' ? 'oui' : 'non')"
                v-model="display_nonactive"
                :false-value="false"
                :true-value="true"
              ></v-switch>
            </v-flex>
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
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click.native="fetchData">Rechercher</v-btn>
          <v-btn icon @click="show_list = !show_list">
            <v-tooltip bottom>
              <span slot="activator">
                <v-icon>{{ show_list ? 'keyboard_arrow_down' : 'keyboard_arrow_up' }}</v-icon>
              </span>
              <span>
                Afficher / masquer la liste des résultats
              </span>
            </v-tooltip>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
  </div>
</template>

<script>
import Vue from 'vue'
import '../plugins/vuetify'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import '@mdi/font/css/materialdesignicons.css' // Ensure you are using css-loader

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
      show: true,
      show_list: false,
      alert: false,
      alert_msg: '',
      display_nonactive: true,
      search: '',
      rules: {
        required: value => !!value || 'Required.',
        nomprenom: value => {
          const pattern = /^[a-zA-Z\s-]*\*?$/
          return pattern.test(value) || 'Valeur invalide'
        },
        id: value => {
          const pattern = /^undefined|[\d]+$/
          return pattern.test(value) || 'Valeur invalide'
        },
        loginnt: value => {
          const pattern = /^undefined|[[a-zA-Z]{1,5}\d+\*?]$/
          return pattern.test(value) || 'Valeur invalide'
        }
      },
      headers: [
        {
          text: '',
          value: '',
          align: 'left',
          sortable: false,
          width: 10
        },
        {
          text: 'Nom',
          value: 'nom',
          align: 'left',
          sortable: true,
          width: 10
        },
        {
          text: 'Prénom',
          value: 'prenom',
          align: 'left',
          sortable: true,
          width: 10
        },
        {
          text: 'Unité organisationnelle',
          value: 'orgunits',
          align: 'left',
          sortable: true,
          width: 400
        },
        {
          text: 'Id',
          value: 'idemploye',
          align: 'left',
          sortable: true,
          width: 10
        },
        {
          text: 'Login NT',
          value: 'mainntlogin',
          align: 'left',
          sortable: true,
          width: 10
        },
      ],
      employee: undefined,
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
    employee: {
      handler (val) {
        if (!this.isEqual(val, EMPLOYEE_INIT)) {
          Object.keys(val).forEach(function (key) {
            if ((val[key] === null) || (val[key] === '')) {
              val[key] = undefined
            }
          })
        }
      },
      deep: true
    }
  },
  methods: {
    display () {
      this.dialog = !this.dialog
    },
    initialize () {
      this.employee = Object.assign({}, EMPLOYEE_INIT)
      this.orgunit = Object.assign({}, ORGUNIT_INIT)
      this.getOUList()
    },
    click () {
      // TODO: Afficher le widget et evt. faire quelques initialisations
    },
    cancel () {
      // TODO: On n'affiche plus le widget
      this.dialog = false
    },
    clear () {
      this.$refs.form.reset()
      this.show_list = false
    },
    ok () {
      // TODO: Retourner un tableau d'objets ou une chaîne JSON en fonction d'un prop
      this.$emit('selection_ready', JSON.stringify(this.selected))
      this.selected = []
      this.dialog = false
    },
    fetchData () {
      if (this.isEqual(this.employee, EMPLOYEE_INIT)) {
        this.alert_msg = 'Vous devez entrer au moins un critère!'
        this.alert = true
        return
      } else {
        EMPLOYE.getList (this.employee, this.display_nonactive, (data) => {
          this.employees = data
          this.show_list = true
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="css" scoped>
.app {
  opacity: 1;
  background-color: #FFFFFF;
}
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
td {
  width: 50px;
}
.disabled {
  color: grey;
}
</style>
