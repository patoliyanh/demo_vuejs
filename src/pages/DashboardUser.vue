<template>
  <div class="container mt-5">
    <h2>User List</h2>
    <button class="btn btn-secondary mb-3" @click="logoutUsers">Logout</button>
    <table class="table table-bordered">
      <thead class="table-dark">
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Email</th>
          <th>Phone</th>
          <th>DOB</th>
          <th>Image</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in store.users" :key="user.id">
          <td>{{ user.id }}</td>
          <td>{{ user.fname }} {{ user.lname }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.phone }}</td>
          <td>{{ user.dob }}</td>
          <td><img :src="user.image" height="50" /></td>
          <td>
            <button class="btn btn-danger btn-sm" @click="deleteUser(user.id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { onMounted } from 'vue';
import { useUserStore } from '../stores/userStore';
import router from '../router';

export default {
  setup() {
    const store = useUserStore();

    const fetchUsers = async () => { await store.fetchUsers(); }

    const deleteUser = async id => {
      if (confirm('Are you sure?')) await store.deleteUser(id);
    }

    const editUser = user => {
      router.push(`/users/edit/${user.id}`);
    }

    const logoutUsers = async () => { await store.logout(); }

    onMounted(fetchUsers);
    return { store, fetchUsers, deleteUser, editUser, logoutUsers };
  }
}
</script>
