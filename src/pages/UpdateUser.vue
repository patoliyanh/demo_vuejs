<!-- <template>
  <div class="update-container">
    <h2 class="mb-4">Update User</h2>

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
        <label>Password (optional)</label>
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
import { useRoute, useRouter } from "vue-router";
import Swal from "sweetalert2";

export default {
  setup() {
    const store = useUserStore();
    const route = useRoute();
    const router = useRouter();
    const userId = route.params.id;

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
      email: yup.string().email("Invalid email").required("Email is required"),
      phone: yup
        .string()
        .matches(/^\+?[1-9]\d{9,14}$/, "Invalid phone")
        .required("Phone is required"),
      dob: yup.date().required("Date of birth is required"),
      gender: yup.string().required("Gender is required"),
    });

    onMounted(() => {
      const existingUser = store.users.find((u) => u.id == userId);
      if (existingUser) {
        Object.assign(form, {
          fname: existingUser.fname,
          lname: existingUser.lname,
          email: existingUser.email,
          phone: existingUser.phone,
          dob: existingUser.dob ? existingUser.dob.split("T")[0] : "",
          gender: existingUser.gender,
        });
      } else {
        store.editUsers(userId).then(() => {
          const u = store.user;
          Object.assign(form, {
            fname: u.fname,
            lname: u.lname,
            email: u.email,
            phone: u.phone,
            dob: u.dob ? u.dob.split("T")[0] : "",
            gender: u.gender,
          });
        });
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

        Swal.fire({
          title: "Update",
          text: "Update successfully",
          toast: true,
          icon: "success",
          timer: 1500
        });
        router.push("/dashboard");
      } catch (err) {
        if (err.inner) {
          err.inner.forEach((e) => (errors[e.path] = e.message));
        } else {
          console.error(err);
          Swal.fire({
            title: "Update",
            text: "Register Failed",
            toast: true,
            icon: "error",
            timer: 1500
          });
        }
      }
    };

    return { form, errors, submit, onFileChange };
  },
};
</script>

<style scoped>
.update-container {
  max-width: 500px;
  margin: 80px auto;
}
</style> -->
<template>
  <div class="update-container">
    <h2 class="mb-4">Update User</h2>

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
        <label>Password (optional)</label>
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
        <label>Profile Image</label>
        <input type="file" @change="onFileChange" class="form-control" />
        <small class="text-danger">{{ errors.image }}</small>
      </div>

      <button class="btn btn-primary">Update</button>
    </form>
  </div>
</template>

<script>
import { reactive, ref, onMounted } from "vue"
import { useUserStore } from "../stores/userStore"
import * as yup from "yup"
import { useRoute, useRouter } from "vue-router"
import Swal from "sweetalert2"

export default {
  setup() {
    const store = useUserStore()
    const route = useRoute()
    const router = useRouter()
    const userId = route.params.id

    const form = reactive({
      fname: "",
      lname: "",
      email: "",
      password: "",
      phone: "",
      dob: "",
      gender: "",
      image: null,
    })

    const errors = reactive({})
    const file = ref(null)

    const schema = yup.object({
      fname: yup.string().required("First name is required"),
      lname: yup.string().required("Last name is required"),
      email: yup.string().email("Invalid email").required("Email is required"),
      phone: yup
        .string()
        .matches(/^\+?[1-9]\d{9,14}$/, "Invalid phone")
        .required("Phone is required"),
      dob: yup.date().required("Date of birth is required"),
      gender: yup.string().required("Gender is required"),
      image: yup
        .mixed()
        .test("fileSize", "File is too large (max 2MB)", (value) => {
          if (!value) return true
          return value.size <= 2 * 1024 * 1024
        })
        .test("fileType", "Unsupported file format", (value) => {
          if (!value) return true
          return ["image/jpeg", "image/png", "image/gif"].includes(value.type)
        }),
    })

    onMounted(async () => {
      const existingUser = store.users.find(u => u.id == userId)
      let u
      if (existingUser) {
        u = existingUser
      } else {
        u = await store.editUsers(userId)
      }
      Object.assign(form, {
        fname: u.fname,
        lname: u.lname,
        email: u.email,
        phone: u.phone,
        dob: u.dob ? u.dob.split("T")[0] : "",
        gender: u.gender,
      })
    })

    const onFileChange = (e) => {
      form.image = e.target.files[0] || null
    }

    const submit = async () => {
      try {
        Object.keys(errors).forEach(k => (errors[k] = ""))
        await schema.validate(form, { abortEarly: false })

        await store.updateUser(userId, form)

        Swal.fire({
          title: "Update",
          text: "User updated successfully",
          toast: true,
          icon: "success",
          timer: 1500,
        })

        router.push("/dashboard")
      } catch (err) {
        if (err.inner) {
          err.inner.forEach(e => (errors[e.path] = e.message))
        } else {
          Swal.fire({
            title: "Update Failed",
            text: "Failed",
            toast: true,
            icon: "error",
            timer: 1500,
          })
        }
      }
    }

    return { form, errors, onFileChange, submit, file }
  },
}
</script>

<style scoped>
.update-container {
  max-width: 500px;
  margin: 80px auto;
}
</style>
