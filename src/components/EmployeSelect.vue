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
          <v-data-table
            v-model="selected"
            :headers="headers"
            :items="employees"
            item-key="idemploye"
            :hide-actions="false"
            select-all
            class="elevation-1"
            prev-icon="mdi-menu-left"
            next-icon="mdi-menu-right"
            sort-icon="mdi-menu-down">
            <template slot="items" slot-scope="props">
              <tr v-show="(props.item.isactive == '1') || display_active" :class="(props.item.isactive == '1') ? '' : 'disabled'">
                <td>
                  <v-checkbox
                  v-model="props.selected"
                  primary
                  hide-details
                  ></v-checkbox>
                </td>
                <td>{{props.item.nom}}</td>
                <td>{{props.item.prenom}}</td>
                <td>{{props.item.orgunits.OrgUnit.filter(orgunit => orgunit.LevelOU == "0")[0].OUName}}</td>
                <td>{{props.item.idemploye}}</td>
                <td>{{extractLoginNT(props.item.mainntlogin)}}</td>
                <!-- <td><v-icon class="mr-2" @click="editItem(props.item)">mdi-account-edit</v-icon></td> -->
              </tr>
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
        :label="'Afficher les employés désactivé: ' + (display_active.toString() == 'true' ? 'oui' : 'non')"
        v-model="display_active"
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
    }
  },
  data () {
    return {
      dialog: false,
      display_active: true,
      headers: [
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
    dialog (val) {
      val || this.close()
    }
  },
  methods: {
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
        this.employees = response.data.Employe

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
          console.log('Error data: ', error.response.data, ' status: ', error.response.status, ' headers: ', error.response.headers)
        } else if (error.request) {
          console.log('Error request: ', error.request)
        } else {
          console.log('Error', error.message)
        }
        console.log(error.config)
      })
    },
    extractLoginNT (mainntlogin) {
      if (/^LAUSANNE_CH/.test(mainntlogin)) {
        return mainntlogin.substring(12)
      } else {
        return mainntlogin
      }
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
