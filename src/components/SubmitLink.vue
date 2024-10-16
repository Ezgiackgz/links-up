<script setup>
import Swal from 'sweetalert2';
import { reactive } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const addLink = reactive({
  id: Date.now(),
  name: "",
  url: ""
});

function handleAdd() {
  if (addLink.name === "" || addLink.url === "") {
    Swal.fire({
      icon: "error",
      title: "Zorunlu Alan",
      text: "Lütfen zorunlu alanları doldurunuz",
    });
    return;
  }
  const storageLinks = JSON.parse(localStorage.getItem('links') || "[]");
  const date = new Date().toISOString();

  storageLinks.push({
    id: Date.now(),
    name: addLink.name,
    url: addLink.url,
    upCount: 0,
    downCount: 0,
    createdDate: date,
    updatedDate: date
  });

  localStorage.setItem('links', JSON.stringify(storageLinks));
  Swal.fire({
    icon: "success",
    title: "Success!",
    text: "Link başarıyla eklendi.",
    timer: 2000,
    showConfirmButton: false
  });
  addLink.name = "";
  addLink.url = "";
}

function backToPAge() {
  router.push('/submit');
}
</script>

<template>
  <div class="container-fluid d-flex justify-content-center align-content-center" id="app">
    <div class="card link-card" style="margin-top: 10rem">
      <div class="card-body">
        <label for="">
          <a href="/" @click="backToPAge" class="go-to-page">
            <i class="bi bi-arrow-return-left"></i>
            <span class="ms-2">Go To Page</span>
          </a>
        </label>
        <h5 class="card-title text-center mb-4">Submit A link</h5>
        <form @submit.prevent="handleAdd">
          <div class="mb-3">
            <label for="exampleInputText" class="form-label">Link Name</label>
            <input type="text" class="form-control" id="exampleInputText" v-model="addLink.name" required>
          </div>
          <div class="mb-3">
            <label for="exampleInputUrl" class="form-label">Link Url</label>
            <input type="url" class="form-control" id="exampleInputUrl" v-model="addLink.url" required>
          </div>
          <button type="submit" class="btn btn-primary w-100">Submit</button>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  border-radius: 12px;
  padding: 20px;
  background-color: #fff;
}

.card-title {
  font-weight: bold;
  color: #333;
}

.form-control {
  border-radius: 8px;
  padding: 10px;
}

.btn-primary {
  background-color: #007bff;
  border-color: #007bff;
  transition: background-color 0.3s ease;
}

.btn-primary:hover {
  background-color: #0056b3;
  border-color: #004085;
}

.link-card {
  width: 45rem;
  margin: 50px auto auto;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.go-to-page {
  position: absolute;
  top: -30px;
  left: 10px;
  font-size: 1rem;
  color: #333;
  margin-bottom: 10px;
  text-decoration: none;
  display: flex;
  align-items: center;
}

.go-to-page i {
  margin-right: 0.5rem;
}
</style>
