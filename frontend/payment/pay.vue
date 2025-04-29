<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";

// Qarzdorlar ma'lumotlari
const debtors = ref([]);
const loading = ref(true);
const errorMessage = ref("");

// API dan qarzdorlar ma'lumotlarini olish
const fetchDebtors = async () => {
  loading.value = true;
  errorMessage.value = "";
  try {
    const response = await axios.get("http://localhost:4100/debtors/getDebtors");
    debtors.value = response.data;
  } catch (error) {
    if (error.response) {
      errorMessage.value = `Xatolik: ${error.response.status} - ${error.response.data.message || "Server xatosi"}`;
    } else if (error.request) {
      errorMessage.value = "Server javob bermadi. Iltimos, internet aloqangizni tekshiring.";
    } else {
      errorMessage.value = "So‘rov yuborishda xatolik yuz berdi.";
    }
    console.error("Error fetching debtors:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchDebtors);
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-10 px-4">
    <div class="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-6">
      <h1 class="text-3xl font-bold mb-6 text-red-700 flex items-center gap-2">
        ❌ Qarzdorlar ro'yxati
      </h1>

      <!-- Xatolik xabari -->
      <div v-if="errorMessage" class="mb-4">
        <p class="text-red-600 bg-red-100 border border-red-300 p-4 rounded-md shadow-sm">
          {{ errorMessage }}
        </p>
        <button
          @click="fetchDebtors"
          class="mt-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md shadow-md transition"
        >
          🔁 Qayta urinib ko‘rish
        </button>
      </div>

      <!-- Yuklanmoqda -->
      <p v-if="loading" class="text-gray-500 text-lg">⏳ Ma’lumotlar yuklanmoqda...</p>

      <!-- Qarzdorlar jadvali -->
      <div v-if="!loading && debtors.length > 0" class="overflow-x-auto rounded-md border mt-4">
        <table class="min-w-full bg-white border border-gray-300">
          <thead class="bg-gray-100 text-gray-700 text-sm uppercase">
            <tr>
              <th class="px-4 py-3 border">#</th>
              <th class="px-4 py-3 border text-left">F.I.O</th>
              <th class="px-4 py-3 border text-center">Telefon raqami</th>
              <th class="px-4 py-3 border text-center">Email</th>
              <th class="px-4 py-3 border text-center">Qarzdorlik summasi</th>
              <th class="px-4 py-3 border text-center">Oxirgi to'lov sanasi</th>
              <th class="px-4 py-3 border text-center">Izoh</th>
            </tr>
          </thead>
          <tbody class="text-gray-700">
            <tr
              v-for="(debtor, index) in debtors"
              :key="debtor.id"
              class="hover:bg-gray-50 transition"
            >
              <td class="px-4 py-3 border text-center">{{ index + 1 }}</td>
              <td class="px-4 py-3 border">{{ debtor.full_name }}</td>
              <td class="px-4 py-3 border text-center">{{ debtor.phone_number }}</td>
              <td class="px-4 py-3 border text-center">{{ debtor.email }}</td>
              <td class="px-4 py-3 border text-center font-semibold text-red-600">
                ${{ debtor.total_debt }}
              </td>
              <td class="px-4 py-3 border text-center">{{ debtor.last_payment_date }}</td>
              <td class="px-4 py-3 border text-center">{{ debtor.notes }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Qarzdor yo'q -->
      <p
        v-if="!loading && debtors.length === 0 && !errorMessage"
        class="text-gray-500 mt-6"
      >
        Barcha qarzdorlar to'lovni amalga oshirgan. Qarzdor yo'q ✅
      </p>
    </div>
  </div>
</template>