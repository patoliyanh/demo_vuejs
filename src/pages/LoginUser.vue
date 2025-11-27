<template>
  <div class="login-container">
    <h2>Login</h2>
    <form @submit.prevent="submit">
      <div class="mb-3">
        <input type="email" class="form-control" v-model="form.email" placeholder="Email" />
        <small class="text-danger">{{ errors.email }}</small>
      </div>
      <div class="mb-3">
        <input type="password" class="form-control" v-model="form.password" placeholder="Password" />
        <small class="text-danger">{{ errors.password }}</small>
      </div>
      <button class="btn btn-primary">Login</button>
    </form>
  </div>
</template>

<script>
import { reactive } from 'vue';
import { useUserStore } from '../stores/userStore';
import * as yup from 'yup';

export default {
  setup() {
    const store = useUserStore();
    const form = reactive({ email: '', password: '' });
    const errors = reactive({});

    const schema = yup.object({
      email: yup.string().required().email(),
      password: yup.string().required(),
    });

    const submit = async () => {
      try {
        Object.keys(errors).forEach(k => errors[k] = '');
        await schema.validate(form, { abortEarly: false });
        await store.login(form);
      } catch (err) {
        if (err.inner) err.inner.forEach(e => errors[e.path] = e.message);
        else alert('Login failed');
      }
    }

    return { form, errors, submit };
  }
}
</script>
<style scoped>
.login-container {
  max-width: 350px;
  margin: 80px auto;
  padding: 30px;
  border: 1px solid #ddd;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.login-container h2 {
  margin-bottom: 20px;
  color: #333;
}

.login-container input {
  display: block;
  width: 90%;
  margin: 10px auto;
  padding: 10px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.login-container button {
  margin-top: 15px;
  padding: 10px 20px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.login-container button:hover {
  background-color: #36966f;
}
</style>
