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
        <label class="form-label">Gender</label>

        <div class="form-check">
          <input class="form-check-input" type="radio" id="male" value="male" v-model="form.gender" />
          <label class="form-check-label" for="male">Male</label>
        </div>

        <div class="form-check">
          <input class="form-check-input" type="radio" id="female" value="female" v-model="form.gender" />
          <label class="form-check-label" for="female">Female</label>
        </div>

        <small class="text-danger">{{ errors.gender }}</small>
      </div>

      <div class="mb-3">
        <label for="image" class="form-label">Profile Image</label>
        <input type="file" @change="onFileChange" id="image" class="form-control" />
        <small class="text-danger">{{ errors.image }}</small>
      </div>
      <button type="submit" class="btn btn-primary">Register</button>
      <p class="mt-3">
        Have a account?
        <router-link to="/" class="text-primary">Login</router-link>
      </p>

    </form>
  </div>
</template>

<script>
import { reactive, ref } from 'vue';
import { useUserStore } from '../stores/userStore';
import * as yup from 'yup';
import Swal from 'sweetalert2';

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
      image: null,
    });

    const errors = reactive({});
    const file = ref(null);

    const schema = yup.object({
      fname: yup.string().required('First name is required'),
      lname: yup.string().required('Last name is required'),
      email: yup.string().email('Invalid email').required('Email is required'),
      password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
      phone: yup.string().required('phone number is valid').matches(/^\+?[1-9]\d{9,14}$/, 'invalid phone'),
      dob: yup.string().required('date is required'),
      gender: yup.string().required('gender is required'),
      image: yup
        .mixed()
        .required('File is required')
        .test('fileSize', 'File too large (max 2MB)', (value) => {
          if (!value) return false
          return value.size <= 2 * 1024 * 1024
        })
        .test('fileType', 'Only JPG/PNG allowed', (value) => {
          if (!value) return false
          return ['image/jpeg', 'image/png'].includes(value.type)
        }),

    });

    const onFileChange = (e) => {
      form.image = e.target.files[0];
    };

    const submit = async () => {
      try {
        Object.keys(errors).forEach((key) => (errors[key] = ''));

        await schema.validate(form, { abortEarly: false });

        const data = { ...form };
        if (file.value) data.image = file.value;
        await store.register(data);
        Swal.fire({
          title: "Register",
          text: "Register successfully",
          toast: true,
          icon: "success",
          timer: 1500
        });

      } catch (err) {
        if (err.inner) {
          err.inner.forEach((e) => {
            errors[e.path] = e.message;
          });
        } else {
          Swal.fire({
            title: "Register failed",
            text: "Register Failed",
            toast: true,
            icon: "error",
            timer: 1500
          });
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
