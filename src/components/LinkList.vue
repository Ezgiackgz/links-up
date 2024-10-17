<script setup>
import Swal from 'sweetalert2';
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';

const linksData = (JSON.parse(localStorage.getItem('links')) || []).reverse();
const router = useRouter();

const currentPage = ref(parseInt(new URLSearchParams(window.location.search).get('page')) || 1);
const limit = 5;
const totalPages = Math.ceil(linksData.length / limit);
const pageCount = ref(totalPages);

const links = ref(getData(linksData));
const hoveredIndex = ref(null);
const selectedOrder = ref(null);
function getData(links) {
  const startIndex = (currentPage.value - 1) * limit;
  const endIndex = startIndex + limit;
  return links.slice(startIndex, endIndex);
}

function goToPage(page) {
  if (page < 1 || page > totalPages) return;
  currentPage.value = page;
  router.push({ path: '/', query: { page: page } });
  links.value = getData(linksData);
}

const goToSubmitPage = () => {
  router.push('/submit');
};

watch(() => new URLSearchParams(window.location.search).get('page'), (newValue) => {
  currentPage.value = parseInt(newValue) || 1;
  links.value = getData(linksData);
});


function sortAndUpdateLinks() {
  linksData.sort((a, b) => {
    const totalVotesA = a.upCount + a.downCount;
    const totalVotesB = b.upCount + b.downCount;

    if (totalVotesB !== totalVotesA) {
      return totalVotesB - totalVotesA;
    }
    return new Date(b.lastVotedDate) - new Date(a.lastVotedDate);
  });

  links.value = getData(linksData);
}

function sortLinks() {
  if (selectedOrder.value === '1') {
    linksData.sort((a, b) => (b.upCount + b.downCount) - (a.upCount + a.downCount));
  } else if (selectedOrder.value === '2') {
    linksData.sort((a, b) => (a.upCount + a.downCount) - (b.upCount + b.downCount));
  } else if (selectedOrder.value === '3') {
    linksData.sort((a, b) => new Date(a.createdDate) - new Date(b.createdDate));
  }
  links.value = getData(linksData);
}

function upVote(index) {
  linksData[index].upCount++;
  linksData[index].lastVotedDate = new Date();
  localStorage.setItem('links', JSON.stringify(linksData));
  sortAndUpdateLinks();
}

function downVote(index) {
  linksData[index].downCount--;
  linksData[index].lastVotedDate = new Date();
  localStorage.setItem('links', JSON.stringify(linksData));
  sortAndUpdateLinks();
}


function deleteLink(index) {
  linksData.splice(index, 1);
  localStorage.setItem('links', JSON.stringify(linksData));
  links.value = getData(linksData);
}

function openDeleteDialog(index) {
  Swal.fire({
    title: 'Emin misin?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sil',
    cancelButtonText: 'Kapat'
  }).then((result) => {
    if (result.isConfirmed) {
      confirmDelete(index);
    }
  });
}

function confirmDelete(index) {
  deleteLink(index);
  Swal.fire({
    icon: 'success',
    text: 'Link başarılı bir şekilde silindi',
    confirmButtonText: 'Tamam'
  });
}
</script>
<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <!-- Submit a Link Button -->
        <div class="text-center mb-4">
          <button class="btn btn-outline-primary btn-lg" @click="goToSubmitPage"><i class="fas fa-plus"></i> SUBMIT A LINK</button>
        </div>
        <!-- Order By Dropdown -->
        <div class="d-flex justify-content-end mb-3">
          <select class="form-select w-auto" v-model="selectedOrder" @change="sortLinks">
            <option selected value="0">Order by</option>
            <option value="1">Most Points</option>
            <option value="2">Least Points</option>
            <option value="3">Oldest</option>
          </select>
        </div>
        <!-- Link List -->
        <ul class="list-group mb-4">
          <li class="list-group-item d-flex justify-content-between align-items-center"
              v-for="(link, index) in links"
              :key="index"
              @mouseenter="hoveredIndex = index"
              @mouseleave="hoveredIndex = null">
            <div class="d-flex align-items-center">
              <div class="align-items-center">
                <span class="badge bg-secondary me-2 p-3 rounded-pill">{{ link.upCount + link.downCount }}</span>
              </div>
              <div class="align-items-center">
                <h5 class="mb-0">{{ link.name }}</h5>
                <p class="mb-0"><a target="_blank" :href="link.url">{{ link.url }}</a></p>
                <span class="text-muted"><small>{{ new Date(link.createdDate).toLocaleString() }}</small></span>
              </div>
            </div>
            <div>
              <div class="align-items-center mt-2">
                <button class="btn btn-outline-success btn-sm mx-1" @click="upVote(index)">
                  <i class="bi bi-hand-thumbs-up"></i>
                </button>
                <button class="btn btn-outline-danger btn-sm mx-1" @click="downVote(index)">
                  <i class="bi bi-hand-thumbs-down-fill"></i>
                </button>
                <button
                  v-if="hoveredIndex === index"
                  class="btn btn-outline-danger btn-sm mx-1"
                  @click="openDeleteDialog(index)">
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </div>
          </li>
        </ul>
        <!-- Pagination -->
        <nav aria-label="Page navigation">
          <ul class="pagination justify-content-center">
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
              <a class="page-link" role="button" @click="goToPage(currentPage - 1)">Previous</a>
            </li>
            <li class="page-item" v-for="(page, index) in pageCount" :key="index">
              <a class="page-link" role="button" :class="{ active: currentPage === page }" @click="goToPage(page)">{{page}}</a>
            </li>
            <li class="page-item" :class="{ disabled: currentPage === pageCount }">
              <a class="page-link" role="button" @click="goToPage(currentPage + 1)">Next</a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </div>
</template>

<style scoped>
button {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
}
.list-group-item {
  transition: background-color 0.3s, box-shadow 0.3s;
}

.list-group-item:hover {
  background-color: #f0f0f0;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
</style>
