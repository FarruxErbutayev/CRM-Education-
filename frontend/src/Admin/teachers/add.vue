<template>
  <div class="w-1/2 mx-auto p-6 border border-gray-300 rounded-lg bg-gray-50">
    <h2 class="text-2xl font-semibold mb-6 text-center">O'qituvchi qo'shish</h2>

    <!-- Form -->
    <form @submit.prevent="submitForm">
      <div class="mb-4">
        <label for="firstname" class="block text-sm font-medium text-gray-700">Ismi:</label>
        <input v-model="form.firstname" type="text" id="firstname" placeholder="Enter Firstname" required
          class="w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      <div class="mb-4">
        <label for="lastname" class="block text-sm font-medium text-gray-700">Familiyasi:</label>
        <input v-model="form.lastname" type="text" id="lastname" placeholder="Enter Lastname" required
          class="w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      <div class="mb-4">
        <label for="birth" class="block text-sm font-medium text-gray-700">Tug'ilgan sana:</label>
        <input v-model="form.birth" type="date" id="birth" required
          class="w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      <div class="mb-4">
        <label for="course_name" class="block text-sm font-medium text-gray-700">Kursning nomi:</label>
        <input v-model="form.course_name" type="text" id="course_name" placeholder="Enter Course Name" required
          class="w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      <div class="mb-4">
        <label for="phone" class="block text-sm font-medium text-gray-700">Telefon raqami:</label>
        <input v-model="form.phone" type="tel" id="phone" placeholder="+998901234567" required
          class="w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      <button type="submit" :disabled="isSubmitting"
        class="w-full p-2 mt-4 bg-green-500 text-white font-semibold rounded-md disabled:bg-gray-300">Submit</button>
    </form>

    <!-- Loading spinner while submitting -->
    <div v-if="isSubmitting" class="text-center mt-4 text-gray-500">Submitting...</div>

    <!-- Success Message -->
    <div v-if="successMessage" class="mt-4 text-green-600 text-center">
      <p>{{ successMessage }}</p>
    </div>

    <!-- Error Message -->
    <div v-if="errorMessage" class="mt-4 text-red-600 text-center">
      <p>{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// Form ma'lumotlari
const form = ref({
  firstname: '',
  lastname: '',
  birth: '',
  course_name: '',
  phone: ''
});

// Loading va status
const isSubmitting = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

// Ma'lumot yuborish funksiyasi
const submitForm = async () => {
  isSubmitting.value = true;
  errorMessage.value = '';
  successMessage.value = '';

  try {
    const response = await fetch('http://localhost:4100/teachers/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(form.value)
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    successMessage.value = `Yangi o'qituvchi ID: ${data.id}`;
    form.value = {
      firstname: '',
      lastname: '',
      birth: '',
      course_name: '',
      phone: ''
    };  // Formani tozalash
  } catch (error) {
    errorMessage.value = `Qo‘shishda xatolik: ${error.message}`;
  } finally {
    isSubmitting.value = false;
  }
};
</script>
