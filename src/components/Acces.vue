<template>
  <div v-if="currentAcces" class="edit-form py-3">
    <p class="headline">Edit Acces</p>

    <v-form ref="form" lazy-validation>
      <v-text-field
          v-model="currentAcces.title"
          :rules="[(v) => !!v || 'Title is required']"
          label="Title"
          required
      ></v-text-field>

      <v-text-field
          v-model="currentAcces.description"
          :rules="[(v) => !!v || 'Description is required']"
          label="Description"
          required
      ></v-text-field>

      <label><strong>Status:</strong></label>
      {{ currentAcces.published ? "Published" : "Pending" }}

      <v-divider class="my-5"></v-divider>

      <v-btn v-if="currentAcces.published"
             @click="updatePublished(false)"
             color="primary" small class="mr-2"
      >
        UnPublish
      </v-btn>

      <v-btn v-else
             @click="updatePublished(true)"
             color="primary" small class="mr-2"
      >
        Publish
      </v-btn>

      <v-btn color="error" small class="mr-2" @click="deleteAcces">
        Delete
      </v-btn>

      <v-btn color="success" small @click="updateAcces">
        Update
      </v-btn>
    </v-form>

    <p class="mt-3">{{ message }}</p>
  </div>

  <div v-else>
    <p>Please click on a Acces...</p>
  </div>
</template>

<script>
import AccesDataService from "../services/AccesDataService";

export default {
  name: "acces",
  data() {
    return {
      currentAcces: null,
      message: "",
    };
  },
  methods: {
    getAcces(id) {
      AccesDataService.get(id)
          .then((response) => {
            this.currentAcces = response.data;
            console.log(response.data);
          })
          .catch((e) => {
            console.log(e);
          });
    },

    updatePublished(status) {
      var data = {
        id: this.currentAcces.id,
        title: this.currentAcces.title,
        description: this.currentAcces.description,
        published: status,
      };

      AccesDataService.update(this.currentAcces.id, data)
          .then((response) => {
            this.currentAcces.published = status;
            console.log(response.data);
          })
          .catch((e) => {
            console.log(e);
          });
    },

    updateAcces() {
      AccesDataService.update(this.currentAcces.id, this.currentAcces)
          .then((response) => {
            console.log(response.data);
            this.message = "The Acces was updated successfully!";
          })
          .catch((e) => {
            console.log(e);
          });
    },

    deleteAcces() {
      AccesDataService.delete(this.currentAcces.id)
          .then((response) => {
            console.log(response.data);
            this.$router.push({ name: "acces" });
          })
          .catch((e) => {
            console.log(e);
          });
    },
  },
  mounted() {
    this.message = "";
    this.getAcces(this.$route.params.id);
  },
};
</script>

<style>
.edit-form {
  max-width: 300px;
  margin: auto;
}
</style>
