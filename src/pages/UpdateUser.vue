<template>
  <div class="update-container">
    <h2 class="mb-4">Update Profile</h2>

    <form @submit.prevent="submit" class="needs-validation">
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
        <input v-model="form.email" type="email" id="email" class="form-control" disabled />
        <small class="text-danger">{{ errors.email }}</small>
      </div>

      <div class="mb-3">
        <label for="password" class="form-label">New Password (optional)</label>
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

      <div class="mb-3 text-start">
        <label class="form-label">Gender</label>

        <div class="form-check">
          <input class="form-check-input" type="radio" id="male" value="male" v-model="form.gender" />
          <label for="male" class="form-check-label">Male</label>
        </div>

        <div class="form-check">
          <input class="form-check-input" type="radio" id="female" value="female" v-model="form.gender" />
          <label for="female" class="form-check-label">Female</label>
        </div>

        <small class="text-danger">{{ errors.gender }}</small>
      </div>

      <div class="mb-3">
        <label for="image" class="form-label">Profile Image (optional)</label>
        <input type="file" @change="onFileChange" id="image" class="form-control" />
        <small class="text-danger">{{ errors.image }}</small>
      </div>

      <button type="submit" class="btn btn-primary">Update</button>
    </form>
  </div>
</template>

<script>
import { reactive, ref, onMounted } from "vue";
import { useUserStore } from "../stores/userStore";
import * as yup from "yup";

export default {
  setup() {
    const store = useUserStore();
    const file = ref(null);

    const form = reactive({
      fname: "",
      lname: "",
      email: "",
      password: "",
      phone: "",
      dob: "",
      gender: "",
    });

    const errors = reactive({});

    const schema = yup.object({
      fname: yup.string().required("First name is required"),
      lname: yup.string().required("Last name is required"),
      phone: yup
        .string()
        .matches(/^\+?[1-9]\d{9,14}$/, "Invalid phone")
        .required("Phone number is required"),
      dob: yup.date().required("Date of birth required"),
      gender: yup.string().required("Gender is required"),
      password: yup.string().min(6, "Password must be at least 6 characters").notRequired(),
    });

    onMounted(() => {
      const user = store.users;
      Object.assign(form, user);
    });

    const onFileChange = (e) => {
      file.value = e.target.files[0];
    };

    const submit = async () => {
      try {
        // Reset errors
        Object.keys(errors).forEach((key) => (errors[key] = ""));
        await schema.validate(form, { abortEarly: false });

        // Prepare FormData for file upload
        const data = new FormData();
        Object.keys(form).forEach((key) => {
          if (form[key]) data.append(key, form[key]);
        });
        if (file.value) {
          data.append("image", file.value);
        }

        await store.updateUser(data, true); // Pass 'true' if your store handles FormData differently

        alert("Profile updated successfully!");
      } catch (err) {
        if (err.inner) {
          err.inner.forEach((e) => {
            errors[e.path] = e.message;
          });
        } else {
          alert("Update failed.");
          console.error(err);
        }
      }
    };

    return { form, errors, submit, onFileChange };
  },
};
</script>

<style scoped>
.update-container {
  max-width: 400px;
  margin: 80px auto;
  padding: 30px;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: left;
}

.update-container input {
  width: 100%;
}

.update-container button {
  margin-top: 15px;
  background-color: #007bff;
}
</style>
