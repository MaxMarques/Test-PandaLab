<template>
  <v-container fluid>
    <v-app-bar app color="#3FEEE6">
      <v-toolbar-title>PandaLab</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn v-if="!isLogged" text @click="toggleForm('login')" :class="{ 'primary--text': activeForm === 'login' }">
        Connexion
      </v-btn>
      <v-btn v-if="!isLogged" text @click="toggleForm('register')" :class="{ 'primary--text': activeForm === 'register' }">
        Inscription
      </v-btn>
      <v-btn v-if="isLogged" text @click="logout()" :class="{ 'primary--text': activeForm === 'register' }">
        Deconnexion
      </v-btn>
    </v-app-bar>
    <v-row class="justify-center">
      <!-- Textfield ecrire message -->
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card v-if="isLogged" class="mx-auto">
          <v-card-text>
            <v-textarea v-model="messagePost" label="Quoi de neuf?" outlined></v-textarea>
            <v-spacer></v-spacer>
            <v-btn @click="sendPost()" color="#FC4445">Envoyer</v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row class="justify-center">
      <v-col cols="12" sm="8" md="6" lg="4">

        <!-- card Afficher message -->
        <v-card v-if="isLogged" v-for="(post, index) in posts" :key="index" class="mx-auto mt-6" max-width="600">
          <v-card-title class="d-flex justify-space-between">
            <span class="headline font-weight-bold">{{ post.author }}</span>
            <span class="caption">{{ formatDate(post.createdAt) }}</span>
          </v-card-title>
          <v-card-text>
            <div v-if="!post.edit" class="text-lg">
              {{ post.message }}
            </div>
            <v-text-field
              v-else
              v-model="post.message"
              class="text-lg"
              outlined
            ></v-text-field>
          </v-card-text>
          <v-card-actions class="likes-container d-flex align-items-center justify-start">
            <div class="d-flex align-items-center">
              <v-icon class="heart-icon" color="#FC4445">mdi-heart-outline</v-icon>
              <span class="likes-count">{{ post.likers.length }}</span>
            </div>
            <v-spacer></v-spacer>
            <div v-if="username === post.author">
                <v-icon v-if="!post.edit" class="edit-icon" color="#3FEEE6" @click="post.edit = true">
                  mdi-pencil
                </v-icon>
                <v-icon v-if="post.edit" class="validate-icon" color="#3FEEE6" @click="editPost(index)">
                  mdi-check
                </v-icon>
                <v-icon @click="deletePost(index)" class="delete-icon" color="#FC4445">mdi-delete</v-icon>
            </div>
          </v-card-actions>
        </v-card>

        <!-- quand il n'y a pas de message -->
        <v-card v-if="isLogged && !posts.length" class="mx-auto mt-6" max-width="600">
          <v-card-title>
            <span class="headline">No Posts Available</span>
          </v-card-title>
          <v-card-text>
            <p>There are no posts available.</p>
          </v-card-text>
        </v-card>

        <!-- Message d'alerte -->
        <div :class="['alert-container', isAlertVisible ? 'isAlertVisible' : '']">
          {{ alertMessage }}
        </div>

        <!-- Formulaire de connexion -->
        <v-card v-if="activeForm === 'login' && !isLogged" class="mx-auto mt-6" max-width="600">
          <v-card-title>
            <span class="headline">Connexion</span>
          </v-card-title>
          <v-card-text>
            <v-form ref="loginForm">
              <v-text-field v-model="login.email" label="Nom d'utilisateur"></v-text-field>
              <v-text-field v-model="login.password" label="Mot de passe" type="password"></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="#FC4445" @click="loginUser">Se connecter</v-btn>
          </v-card-actions>
        </v-card>

        <!-- Formulaire d'inscription -->
        <v-card v-if="activeForm === 'register' && !isLogged" class="mx-auto mt-6" max-width="600">
          <v-card-title>
            <span class="headline">Inscription</span>
          </v-card-title>
          <v-card-text>
            <v-form ref="registerForm">
              <v-text-field v-model="register.email" label="Nom d'utilisateur"></v-text-field>
              <v-text-field v-model="register.password" label="Mot de passe" type="password"></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="#FC4445" @click="registerUser">S'inscrire</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      activeForm: 'login',
      login: {
        email: '',
        password: '',
      },
      register: {
        email: '',
        password: '',
      },
      isLogged: false,
      posts: [],
      isEditing: [],
      isAlertVisible: false,
      alertMessage: '',
      alertType: '',
      messagePost: '',
      username: '',
    };
  },
  mounted() {
    let token = localStorage.getItem("token");

    if (token) {
      this.isLogged = true;
      this.getPost();
      this.username = localStorage.getItem("username");
    }
  },

  methods: {
    toggleForm(form) {
      this.activeForm = form;
    },
    async loginUser() {
      try {
        const response = await axios.post('http://localhost:3000/user/login', {
          username: this.login.email,
          password: this.login.password,
        });
        console.log('API response:', response.data);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("username", response.data.user);
        this.showAlert("Connexion réussie !", "success");
        console.log(this.author)
        this.isLogged = true
        this.username = response.data.user;
      } catch (error) {
        console.error('API error:', error);
        this.showAlert("Une erreur s'est produite lors de la connexion.", "error");
      }
    },
    async registerUser() {
      try {
        const response = await axios.post('http://localhost:3000/user/register', {
          username: this.register.email,
          password: this.register.password,
        });
        console.log('API response:', response.data);
        this.showAlert("Compte créé avec succès !", "success");
      } catch (error) {
        console.error('API error:', error);
        this.showAlert("Une erreur s'est produite lors de la création du compte.", "error");
      }
    },
    async getPost() {
      try {
        const response = await axios.get('http://localhost:3000/post');
        console.log('API response:', response.data);
        this.posts = response.data;
      } catch (error) {
        console.error('API error:', error);
      }
    },
    async sendPost() {
      try {
        const response = await axios.post('http://localhost:3000/post', {
          message: this.messagePost
        }, { headers: { Authorization: localStorage.getItem("token") } });
        console.log('API response:', response.data);
        this.messagePost = '';
        await this.getPost();
      } catch (error) {
        console.error('API error:', error);
      }
    },
    async editPost(postId) {
      this.posts[postId].edit = false
      try {
        const response = await axios.put(`http://localhost:3000/post/${this.posts[postId]._id}`, {
          message: this.posts[postId].message
        });
        console.log('API response:', response.data);
      } catch (error) {
        console.error('API error:', error);
      }
    },
    async deletePost(postId) {
      try {
        await axios.delete(`http://localhost:3000/post/${this.posts[postId]._id}`);
        const index = this.posts.findIndex((post) => post._id === postId);
        if (index !== -1) {
          this.posts.splice(index, 1);
        }
        this.showAlert('Post deleted successfully!', 'success');
        await this.getPost();
      } catch (error) {
        console.error('API error:', error);
        this.showAlert('An error occurred while deleting the post.', 'error');
      }
    },
    logout() {
      localStorage.clear();
      this.isLogged = false;
    },
    formatDate(date) {
      const formattedDate = new Date(date).toLocaleDateString();
      return formattedDate;
    },
    showAlert(message, type) {
      this.alertMessage = message;
      this.alertType = type;
      this.isAlertVisible = true;
      setTimeout(() => {
        this.isAlertVisible = false;
    }, 2000);
  },
  },
};
</script>

<style>
.alert-container {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  padding: 10px;
  background-color: #333;
  color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  display: none;
}

.isAlertVisible {
  display: block;
}
</style>

  