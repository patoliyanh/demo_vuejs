<template>
  <div class="update-container">
    <h2 class="mb-4">Update Users</h2>

    <form @submit.prevent="submit">
      <div class="mb-3">
        <label>First Name</label>
        <input v-model="form.fname" type="text" class="form-control" />
        <small class="text-danger">{{ errors.fname }}</small>
      </div>

      <div class="mb-3">
        <label>Last Name</label>
        <input v-model="form.lname" type="text" class="form-control" />
        <small class="text-danger">{{ errors.lname }}</small>
      </div>

      <div class="mb-3">
        <label>Email</label>
        <input v-model="form.email" type="email" class="form-control" />
        <small class="text-danger">{{ errors.email }}</small>
      </div>

      <div class="mb-3">
        <label>New Password (optional)</label>
        <input v-model="form.password" type="password" class="form-control" />
        <small class="text-danger">{{ errors.password }}</small>
      </div>

      <div class="mb-3">
        <label>Phone</label>
        <input v-model="form.phone" type="text" class="form-control" />
        <small class="text-danger">{{ errors.phone }}</small>
      </div>

      <div class="mb-3">
        <label>Date of Birth</label>
        <input v-model="form.dob" type="date" class="form-control" />
        <small class="text-danger">{{ errors.dob }}</small>
      </div>

      <div class="mb-3">
        <label>Gender</label>
        <div class="form-check">
          <input type="radio" value="male" v-model="form.gender" class="form-check-input" />
          <label class="form-label">Male</label>
        </div>
        <div class="form-check">
          <input type="radio" value="female" v-model="form.gender" class="form-check-input" />
          <label class="form-label">Female</label>
        </div>
        <small class="text-danger">{{ errors.gender }}</small>
      </div>

      <div class="mb-3">
        <label>Profile Image (optional)</label>
        <input type="file" @change="onFileChange" class="form-control" />
      </div>

      <button class="btn btn-primary">Update</button>
    </form>
  </div>
</template>

<script>
import { reactive, ref, onMounted } from "vue";
import { useUserStore } from "../stores/userStore";
import * as yup from "yup";
import { useRoute } from "vue-router";
import router from "@/router";

export default {
  setup() {
    const route = useRoute();
    const store = useUserStore();
    const userId = route.params.id;

    const file = ref(null);

    const form = reactive({
      fname: "",
      lname: "",
      email: "",
      // password: "",
      phone: "",
      dob: "",
      gender: "",
    });

    const errors = reactive({});

    const schema = yup.object({
      fname: yup.string().required("First name is required"),
      lname: yup.string().required("Last name is required"),
      phone: yup.string()
        .matches(/^\+?[1-9]\d{9,14}$/, "Invalid phone")
        .required("Phone is required"),
      dob: yup.date().required("Date of birth is required"),
      gender: yup.string().required("Gender is required"),
      // password: yup.string().min(6).notRequired(),
    });

    onMounted(async () => {
      console.log(userId)

      await store.editUsers(userId);
      if (store.user) {
        form.fname = store.user.fname || store.user.firstName || "";
        form.lname = store.user.lname || store.user.lastName || "";
        form.email = store.user.email || "";
        form.phone = store.user.phone || "";
        form.dob = store.user.dob ? store.user.dob.split("T")[0] : "";
        form.gender = store.user.gender || "";
      }
    });



    const onFileChange = (e) => {
      file.value = e.target.files[0];
    };

    const submit = async () => {
      try {
        Object.keys(errors).forEach((k) => (errors[k] = ""));

        await schema.validate(form, { abortEarly: false });

        const data = { ...form };
        if (file.value) data.image = file.value;

        await store.updateUser(userId, data);

        alert("Updated successfully!");
        router.push('/dashboard');
      } catch (err) {
        if (err.inner) {
          err.inner.forEach((e) => (errors[e.path] = e.message));
        } else {
          console.error(err);
          alert("Update failed.");
        }
      }
    };

    return { form, errors, submit, onFileChange, route };
  },
};
</script>

<style scoped>
.update-container {
  max-width: 400px;
  margin: 80px auto;
}
</style>
