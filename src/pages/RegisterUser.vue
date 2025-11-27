<template>
  <div class="register-container">
    <h2 class="mb-4">Register</h2>

    <form @submit.prevent="submit" enctype="multipart/form-data" class="needs-validation">
      <div class="mb-3">
        <label for="fname" class="form-label">First Name</label>
        <input v-model="form.fname" type="text" id="fname" class="form-control" />
        <small class="text-danger">{{ errors.fname }}</small>
      </div>

      <div class="mb-3">
        <label for="lname" class="form-label">Last Name</label>
        <input v-model="form.lname" type="text" id="lname" class="form-control" />
        <small class="text-danger">{{ errors.lname }}</small>
      </div>


      <div class="mb-3">
        <label for="email" class="form-label">Email</label>
        <input v-model="form.email" type="email" id="email" class="form-control" />
        <small class="text-danger">{{ errors.email }}</small>
      </div>

      <div class="mb-3">
        <label for="password" class="form-label">Password</label>
        <input v-model="form.password" type="password" id="password" class="form-control" />
        <small class="text-danger">{{ errors.password }}</small>
      </div>

      <div class="mb-3">
        <label for="phone" class="form-label">Phone</label>
        <input v-model="form.phone" type="text" id="phone" class="form-control" />
        <small class="text-danger">{{ errors.phone }}</small>
      </div>

      <div class="mb-3">
        <label for="dob" class="form-label">Date of Birth</label>
        <input v-model="form.dob" type="date" id="dob" class="form-control" />
        <small class="text-danger">{{ errors.dob }}</small>
      </div>

      <div class="mb-3">
        <label for="gender" class="form-label">Gender</label>
        <input v-model="form.gender" type="text" id="gender" class="form-control" />
        <small class="text-danger">{{ errors.gender }}</small>
      </div>


      <div class="mb-3">
        <label for="image" class="form-label">Profile Image</label>
        <input type="file" @change="onFileChange" id="image" class="form-control" />
        <small class="text-danger">{{ errors.image }}</small>
      </div>
      <button type="submit" class="btn btn-primary">Register</button>
    </form>
  </div>
</template>

<script>
import { reactive, ref } from 'vue';
import { useUserStore } from '../stores/userStore';
import * as yup from 'yup';

export default {
  setup() {
    const store = useUserStore();
    const form = reactive({
      fname: '',
      lname: '',
      email: '',
      password: '',
      phone: '',
      dob: '',
      gender: '',
    });

    const errors = reactive({});
    const file = ref(null);

    const schema = yup.object({
      fname: yup.string().required('First name is required'),
      lname: yup.string().required('Last name is required'),
      email: yup.string().email('Invalid email').required('Email is required'),
      password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
      phone: yup.string().required('phone number is valid').matches(/^\+?[1-9]\d{9,14}$/, 'invalid phone'),
      dob: yup.date('date is required format'),
      gender: yup.string().required('gender is required'),
    });

    const onFileChange = (e) => {
      file.value = e.target.files[0];
    };

    const submit = async () => {
      try {
        Object.keys(errors).forEach((key) => (errors[key] = ''));

        await schema.validate(form, { abortEarly: false });

        const data = { ...form };
        if (file.value) data.image = file.value;
        await store.register(data);

        alert('Registration successful! Please login.');
      } catch (err) {
        if (err.inner) {
          err.inner.forEach((e) => {
            errors[e.path] = e.message;
          });
        } else {
          alert('Registration failed. Please try again.');
          console.error(err);
        }
      }
    };

    return { form, errors, submit, onFileChange };
  },
};
</script>

<style scoped>
.register-container {
  max-width: 30%;
  margin: 80px auto;
  padding: 30px;
  border: 1px solid #ddd;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.register-container h2 {
  margin-bottom: 20px;
  color: #333;
}

.register-container input {
  display: block;
  width: 90%;
  margin: 10px auto;
  padding: 10px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.register-container button {
  margin-top: 15px;
  padding: 10px 20px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.register-container button:hover {
  background-color: #36966f;
}
</style>
