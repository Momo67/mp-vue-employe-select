<template>
  <div id="app">
  <v-app id="inspire">
    <v-layout row justify-center>
      <v-dialog v-model="dialog"  max-width="600px">
        <!-- <v-btn slot="activator" color="primary" dark>Open Dialog</v-btn> -->
        <template slot="activator">
          Cliquer ici!
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

        <v-card v-show="show_list">
          <v-card-title>
            <v-spacer></v-spacer>
            <v-layout wrap>
              <v-flex xs8 offset-xs4>
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
          <v-card-text>
            <v-layout wrap>
              <v-flex xs12>
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

                  <template slot="headerCell" slot-scope="props">
                    <v-tooltip bottom>
                      <span slot="activator">
                        {{ props.header.text }}
                      </span>
                      <span>
                        {{ props.header.text }}
                      </span>
                    </v-tooltip>
                  </template>

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
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click.native="cancel">Annuler</v-btn>
            <v-btn color="blue darken-1" flat @click.native="ok">OK</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
  </v-app>
</div>
</template>

<script>
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
