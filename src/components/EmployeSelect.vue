<template lang="html">
  <v-app>
    <v-container fluid>

      <v-layout row wrap>
        <v-toolbar flat color="white">
          <v-toolbar-title>Sélection d'employés</v-toolbar-title>
        </v-toolbar>
      </v-layout>

      <v-layout row wrap>
        <v-divider horizontal></v-divider>
        <v-data-table
          v-model="selected"
          :headers="headers"
          :items="employees"
          item-key="id"
          :hide-actions="false"
          select-all
          class="elevation-1"
          prev-icon="mdi-menu-left"
          next-icon="mdi-menu-right"
          sort-icon="mdi-menu-down">
          <template slot="items" slot-scope="props">
            <tr v-show="props.item.active || display_active" :class="props.item.active ? '' : 'disabled'">
              <td>
                <v-checkbox
                v-model="props.selected"
                primary
                hide-details
                ></v-checkbox>
              </td>
              <td>{{props.item.nom}}</td>
              <td>{{props.item.prenom}}</td>
              <td>{{props.item.id}}</td>
              <td><v-icon class="mr-2" @click="editItem(props.item)">mdi-account-edit</v-icon></td>
            </tr>
          </template>
          <template slot="no-data">
            <v-alert :value="true" color="error" icon="warning">
              Sorry, nothing to display here :(
            </v-alert>
          </template>
        </v-data-table>
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
          text: 'Id',
          value: 'id',
          align: 'left',
          sortable: true
        },
        {
          text: '',
          value: '',
          align: 'left',
          sortable: false
        },
      ],
      selected: []
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
    }
  }
}
</script>

<style lang="css">
</style>
