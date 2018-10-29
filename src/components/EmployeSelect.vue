<template>
  <div id="app">
  <v-app id="inspire">
    <v-layout row>
      <v-dialog v-model="dialog" max-width="800px" :fullscreen="$vuetify.breakpoint.xsOnly">
        <template slot="activator">
          <slot>
            Cliquer ici!
          </slot>
        </template>

        <v-card>
          <v-card-title>
            <span class="headline">{{multi ? $tc('userInterface.selectEmp' , 2) : $tc('userInterface.selectEmp', 1)}}</span>
          </v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn icon @click="show_form = !show_form">
              <v-tooltip bottom>
                <span slot="activator">
                  <v-icon>{{ show_form ? 'keyboard_arrow_down' : 'keyboard_arrow_up' }}</v-icon>
                </span>
                <span>
                  {{$t('userInterface.displayCriterionBtn')}}
                </span>
              </v-tooltip>
            </v-btn>
          </v-card-actions>
        </v-card>

        <v-card v-show="show_form">
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn icon @click="clear">
              <v-tooltip bottom>
                <span slot="activator">
                  <v-icon>clear</v-icon>
                </span>
                <span>
                  {{$t('userInterface.resetBtn')}}
                </span>
              </v-tooltip>
            </v-btn>
          </v-card-actions>
          <v-card-text>
            <v-container grid-list-md class="pt-0 pb-0">
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
                      :label="$t('userInterface.orgUnit')"
                      :placeholder="$t('userInterface.searchHint')"
                    ></v-autocomplete>
                  </v-flex>
                  <v-flex xs12 sm6 md6>
                    <v-text-field v-model="employee.nom" :label="$t('userInterface.lastName')" clearable :rules="[rules.nomprenom]"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 md6>
                    <v-text-field v-model="employee.prenom" :label="$t('userInterface.firstName')" clearable :rules="[rules.nomprenom]"></v-text-field>
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
                  :label="$t('userInterface.displayNonActive')+': ' + (display_nonactive ? $t('userInterface.yes') : $t('userInterface.no'))"
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
                  {{$t('userInterface.alertMsg')}}
                </v-alert>
              </v-flex>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click.native="fetchData">{{$t('userInterface.searchBtn')}}</v-btn>
            <v-btn icon @click="show_list = !show_list">
              <v-tooltip bottom>
                <span slot="activator">
                  <v-icon>{{ show_list ? 'keyboard_arrow_down' : 'keyboard_arrow_up' }}</v-icon>
                </span>
                <span>
                  {{$t('userInterface.displayListBtn')}}
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
                  :label="$t('userInterface.search')"
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
                  sort-icon="mdi-menu-down"
                  :no-data-text="$t('userInterface.noDataText')"
                  :no-results-text="$t('dataIterator.noResultsText')"
                  :rows-per-page-items="[5,10,25,{'text':$t('dataIterator.rowsPerPageAll'),'value':-1}]"
                  :rows-per-page-text="$t('dataTable.rowsPerPageText')">

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
                      <td>{{getOUFinal(props.item.orgunits.OrgUnit)}}</td>
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
                        <span>Unité organisationnelle: {{getOUPath(props.item.orgunits.OrgUnit)}}</span>
                      </v-card-text>
                    </v-card>
                  </template>

                  <template slot="no-data">
                    <v-alert :value="true" type="info">
                      {{$t('userInterface.noResult')}}
                    </v-alert>
                  </template>

                </v-data-table>
              </v-flex>
            </v-layout>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click.native="cancel">{{$t('userInterface.cancel')}}</v-btn>
            <v-btn color="blue darken-1" flat @click.native="ok">OK</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
  </v-app>
</div>
</template>

<script>
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
    showNonActive: {
      type: Boolean,
      default: false,
      require: false
    },
    allowNonactiveSelectable: {
      type: Boolean,
      default: false,
      require: false
    },
    json: {
      type: Boolean,
      default: true,
      require: false
    }
  },
  data () {
    return {
      dialog: false,
      show: true,
      show_form: true,
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
        if ((!this.multi) && (val.length >1)) {
          val.splice(0, val.length-1)
        }
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
      this.display_nonactive = this.showNonActive
      this.getOUList()
    },
    cancel () {
      this.dialog = false
    },
    clear () {
      this.$refs.form.reset()
      this.employee = Object.assign({}, EMPLOYEE_INIT)
      this.employees = []
      this.show_list = false
    },
    ok () {
      this.$emit('selection_ready', this.json ? JSON.stringify(this.selected) : this.selected)
      this.selected = []
      this.dialog = false
    },
    fetchData () {
      this.alert = false
      if (this.isEqual(this.employee, EMPLOYEE_INIT)) {
        this.alert = true
        this.show_form = true
      } else {
        EMPLOYE.getList (this.employee, this.display_nonactive, (data) => {
          this.employees = data
          this.show_form = false
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
    getOUFinal (orgunits)
    {
      if (orgunits !== undefined) {
        if (Array.isArray(orgunits)) {
          let __myorgunits = orgunits.slice()
          __myorgunits.sort(function (a, b) {
            return parseInt(b.LevelOU) - parseInt(a.LevelOU)
          })
          let __oufinal = ''
          __myorgunits.forEach(function (orgunit, index, array) {
            if (index === array.length-1)
              __oufinal = orgunit.OUName
          })
          return __oufinal
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
          __isequal = false
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
#inspire {
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

<i18n src="../locales/fr.json"></i18n>
<i18n src="../locales/en.json"></i18n>
