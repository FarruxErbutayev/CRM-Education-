<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
      <div class="p-8">
        <div class="text-center mb-6">
          <h2 class="text-2xl font-bold text-gray-900">O'quvchilarni guruhlarga biriktirish</h2>
        </div>

        <!-- Xabar bloki -->
        <div v-if="message" :class="['p-4 mb-4 rounded-md text-sm', messageClass]">
          <p>{{ message }}</p>
        </div>

        <form @submit.prevent="addStudentToGroup" class="space-y-6">
          <!-- Guruh tanlash -->
          <div>
            <label for="group" class="block text-sm font-medium text-gray-700">Guruh</label>
            <div class="mt-1 relative">
              <select
                id="group"
                v-model="selectedGroup"
                class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm rounded-md disabled:bg-gray-100 disabled:cursor-not-allowed"
                required
                :disabled="loading.groups"
              >
                <option value="" disabled>Guruhni tanlang</option>
                <option v-for="group in groups" :key="group.id" :value="group.id">
                  {{ group.group_name }}
                </option>
              </select>
              <!-- Guruhlar yuklanmoqda indikatori -->
              <div v-if="loading.groups" class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <div class="animate-spin h-5 w-5 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"> <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle> <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path> </svg>
                </div>
              </div>
            </div>
          </div>

          <!-- O'quvchi tanlash -->
          <div>
            <label for="student" class="block text-sm font-medium text-gray-700">O'quvchi</label>
            <div class="mt-1 relative">
              <select
                id="student"
                v-model="selectedStudent"
                class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm rounded-md disabled:bg-gray-100 disabled:cursor-not-allowed"
                required
                :disabled="loading.students || !selectedGroup"
                title="Avval guruhni tanlang"
              >
                <option value="" disabled>O'quvchini tanlang</option>
                <!-- Optimallashtirish: Faqat shu guruhda yo'q o'quvchilarni ko'rsatish -->
                <option v-for="student in availableStudents" :key="student.id" :value="student.id">
                  {{ student.firstname }} {{ student.lastname }}
                </option>
              </select>
               <!-- O'quvchilar yuklanmoqda indikatori -->
              <div v-if="loading.students" class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                 <div class="animate-spin h-5 w-5 text-gray-400">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"> <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle> <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path> </svg>
                 </div>
              </div>
            </div>
          </div>

          <!-- Biriktirish tugmasi -->
          <div>
            <button
              type="submit"
              :disabled="loading.assignment || !selectedGroup || !selectedStudent"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <!-- Biriktirish yuklanmoqda indikatori -->
              <span v-if="loading.assignment" class="mr-2">
                <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"> <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle> <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path> </svg>
              </span>
              Biriktirish
            </button>
          </div>
        </form>

        <!-- Biriktirilgan o'quvchilar jadvali -->
        <div class="mt-8">
           <h3 v-if="selectedGroup" class="text-lg font-medium text-gray-900 mb-4">
             Guruhdagi o'quvchilar: <span class="font-semibold">{{ selectedGroupName }}</span>
           </h3>

           <!-- Jadval yuklanmoqda indikatori -->
           <div v-if="loading.assignedStudents" class="text-center py-4 text-gray-500">
             <div class="flex items-center justify-center">
               <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-emerald-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                 <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                 <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
               </svg>
               <span>Ma'lumotlar yuklanmoqda...</span>
             </div>
           </div>

           <!-- Jadval yoki xabarlar -->
           <div v-else-if="selectedGroup && assignedStudents.length > 0" class="overflow-x-auto border rounded-lg">
             <table class="min-w-full divide-y divide-gray-200">
               <thead class="bg-gray-50">
                 <tr>
                   <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                   <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ism Familiya</th>
                   <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amallar</th>
                 </tr>
               </thead>
               <tbody class="bg-white divide-y divide-gray-200">
                 <tr v-for="(student, index) in assignedStudents" :key="student.id">
                   <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ index + 1 }}</td>
                   <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                     {{ student.firstname || student.name }} {{ student.lastname || '' }}
                   </td>
                   <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                     <button
                       @click="removeStudentFromGroup(student.id)"
                       class="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
                       :disabled="loading.removal === student.id"
                       title="Guruhdan o'chirish"
                     >
                       <!-- O'chirish yuklanmoqda indikatori (faqat shu qator uchun) -->
                        <svg v-if="loading.removal === student.id" class="animate-spin inline-block h-4 w-4 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"> <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle> <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path> </svg>
                       <span v-else>O'chirish</span>
                     </button>
                   </td>
                 </tr>
               </tbody>
             </table>
           </div>
           <!-- Guruh tanlangan, lekin o'quvchi yo'q -->
           <div v-else-if="selectedGroup && !loading.assignedStudents" class="text-center py-4 text-gray-500 border rounded-lg">
             Bu guruhda hali o'quvchilar yo'q.
           </div>
           <!-- Guruh tanlanmagan -->
           <div v-else-if="!selectedGroup" class="text-center py-4 text-gray-500">
             Biriktirilgan o'quvchilarni ko'rish uchun guruh tanlang.
           </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      groups: [], // Barcha mavjud guruhlar ro'yxati
      students: [], // Barcha mavjud o'quvchilar ro'yxati
      assignedStudents: [], // Tanlangan guruhga biriktirilgan o'quvchilar ro'yxati
      selectedGroup: '', // Tanlangan guruh ID si
      selectedStudent: '', // Tanlangan o'quvchi ID si
      loading: {
        groups: false, // Guruhlarni yuklash
        students: false, // O'quvchilarni yuklash
        assignment: false, // O'quvchini guruhga biriktirish
        assignedStudents: false, // Guruhdagi o'quvchilarni yuklash
        removal: null, // Qaysi student o'chirilayotganini bilish uchun ID ni saqlaymiz (yoki true/false)
      },
      message: '', // Foydalanuvchiga ko'rsatiladigan xabar
      messageClass: '', // Xabar uchun CSS klass (muvaffaqiyat/xatolik)
      apiBaseUrl: 'http://localhost:4100/' // API manzili (oxirida '/' bo'lishi muhim)
    }
  },
  computed: {
    // Tanlangan guruh nomini olish uchun
    selectedGroupName() {
      const group = this.groups.find(g => g.id === this.selectedGroup);
      return group ? group.group_name : '';
    },
    // O'quvchi tanlash ro'yxati uchun (ixtiyoriy: faqat guruhda yo'q o'quvchilar)
    availableStudents() {
      // Hozircha barcha o'quvchilarni qaytaramiz
      // Agar faqat guruhda yo'qlarni ko'rsatmoqchi bo'lsangiz:
      // const assignedIds = new Set(this.assignedStudents.map(s => s.id));
      // return this.students.filter(s => !assignedIds.has(s.id));
      return this.students;
    }
  },
  watch: {
    // Guruh tanlanganda
    selectedGroup(newGroupId, oldGroupId) {
      this.assignedStudents = []; // Eskisini tozalash
      this.selectedStudent = ''; // O'quvchi tanlovini tozalash
      this.message = ''; // Xabarni tozalash
      if (newGroupId) {
        this.fetchAssignedStudents(newGroupId);
      }
    }
  },
  mounted() {
    // Komponent yuklanganda guruhlar va o'quvchilarni olib kelamiz
    this.fetchGroups();
    this.fetchStudents();
  },
  methods: {
    // Barcha guruhlarni API dan olish
    async fetchGroups() {
      this.loading.groups = true;
      this.message = '';
      try {
        const response = await fetch(`${this.apiBaseUrl}groups/getGroups`); // Endpointni tekshiring
        if (!response.ok) {
           const errorData = await response.json().catch(() => ({ message: response.statusText }));
          throw new Error(errorData.message || `Server xatosi: ${response.status}`);
        }
        // API javobi to'g'ridan-to'g'ri massiv qaytarsa:
        this.groups = await response.json();
        // Agar API { data: [...] } qaytarsa:
        // const data = await response.json();
        // this.groups = data.data || data; // API javobiga moslashtiring

      } catch (error) {
        console.error('Guruhlarni yuklashda xatolik:', error);
        this.showMessage(`Guruhlarni yuklashda xatolik: ${error.message}`, 'error');
      } finally {
        this.loading.groups = false;
      }
    },

    // Barcha o'quvchilarni API dan olish
    async fetchStudents() {
      this.loading.students = true;
      this.message = '';
      try {
        const response = await fetch(`${this.apiBaseUrl}pupil/get`); // Endpointni tekshiring
         if (!response.ok) {
           const errorData = await response.json().catch(() => ({ message: response.statusText }));
           throw new Error(errorData.message || `Server xatosi: ${response.status}`);
         }
        const data = await response.json();
        // Original kod bo'yicha .data ichida keladi
        this.students = data.data || []; // Agar data bo'lmasa, bo'sh massiv
      } catch (error) {
        console.error("O'quvchilarni yuklashda xatolik:", error);
        this.showMessage(`O'quvchilarni yuklashda xatolik: ${error.message}`, 'error');
      } finally {
        this.loading.students = false;
      }
    },

    // Tanlangan guruhdagi o'quvchilarni API dan olish
    async fetchAssignedStudents(groupId) {
      this.loading.assignedStudents = true;
      this.message = ''; // Xabarni tozalash
      this.assignedStudents = []; // Eskisini tozalash
      try {
        // BU ENDPOINTNI O'ZINGIZNING API GA MOSLASHTIRING!
        // Masalan: /groups/{groupId}/pupils yoki /assignments?groupId={groupId}
        const response = await fetch(`${this.apiBaseUrl}groups/${groupId}/students`); // Taxminiy endpoint
        if (!response.ok) {
           const errorData = await response.json().catch(() => ({ message: response.statusText }));
           // 404 (Not Found) xatolik bo'lsa, bu guruhda o'quvchi yo'q degani bo'lishi mumkin
           if (response.status === 404) {
             this.assignedStudents = []; // Bo'sh ro'yxat
             return; // Xatolik xabari chiqarmaymiz
           }
           throw new Error(errorData.message || `Server xatosi: ${response.status}`);
        }
        const data = await response.json();
        // API javobiga qarab moslashtiring. Ism va familiya alohida kelishi kerak
        this.assignedStudents = data || [];
      } catch (error) {
        console.error(`Guruhdagi (${groupId}) o'quvchilarni yuklashda xatolik:`, error);
        this.showMessage(`Guruhdagi o'quvchilarni yuklashda xatolik: ${error.message}`, 'error');
        this.assignedStudents = []; // Xatolik bo'lsa ham tozalash
      } finally {
        this.loading.assignedStudents = false;
      }
    },

    // Tanlangan o'quvchini tanlangan guruhga qo'shish
    async addStudentToGroup() {
      if (!this.selectedGroup || !this.selectedStudent) {
        this.showMessage("Iltimos, avval guruh va o'quvchini tanlang", 'error');
        return;
      }

      // Optimallashtirish: O'quvchi allaqachon guruhda bo'lsa, qayta qo'shmaslik
      if (this.assignedStudents.some(s => s.id === this.selectedStudent)) {
          this.showMessage("Bu o'quvchi allaqachon guruhga qo'shilgan", 'warning'); // 'warning' uchun CSS qo'shish kerak bo'ladi
          this.selectedStudent = ''; // Tanlovni tozalash
          return;
      }


      this.loading.assignment = true;
      this.message = '';
      try {
        // Original koddagi endpoint
        const response = await fetch(`${this.apiBaseUrl}groups/addStudentsToGroup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
             // Agar kerak bo'lsa, avtorizatsiya tokenini qo'shing
             // 'Authorization': 'Bearer YOUR_TOKEN'
          },
          body: JSON.stringify({
            groupId: this.selectedGroup,
            studentId: this.selectedStudent
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: response.statusText }));
          throw new Error(errorData.message || `Server xatosi: ${response.status}`);
        }

        // Muvaffaqiyatli javobni tekshirish (ba'zi APIlar ma'lumot qaytaradi)
        // const result = await response.json();

        this.showMessage("O'quvchi guruhga muvaffaqiyatli biriktirildi", 'success');
        // Jadvalni yangilash
        await this.fetchAssignedStudents(this.selectedGroup);
        this.selectedStudent = ''; // O'quvchi tanlovini tozalash

      } catch (error) {
        console.error("O'quvchini guruhga biriktirishda xatolik:", error);
        this.showMessage(`Biriktirishda xatolik: ${error.message}`, 'error');
      } finally {
        this.loading.assignment = false;
      }
    },

    // O'quvchini guruhdan olib tashlash
    async removeStudentFromGroup(studentId) {
      if (!confirm("Haqiqatan ham bu o'quvchini guruhdan olib tashlamoqchimisiz?")) {
        return;
      }

      this.loading.removal = studentId; // Qaysi student o'chirilayotganini belgilash
      this.message = '';
      try {
        // BU ENDPOINTNI O'ZINGIZNING API GA MOSLASHTIRING!
        // Masalan: DELETE /assignments/{assignmentId} yoki DELETE /groups/{groupId}/students/{studentId}
        const response = await fetch(`${this.apiBaseUrl}groups/${this.selectedGroup}/students/${studentId}`, {
          method: 'DELETE',
           headers: {
              // Agar kerak bo'lsa, avtorizatsiya tokenini qo'shing
              // 'Authorization': 'Bearer YOUR_TOKEN'
           }
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: response.statusText }));
          throw new Error(errorData.message || `Server xatosi: ${response.status}`);
        }

        // Muvaffaqiyatli javob (ba'zi APIlar 204 No Content qaytaradi)
        // if (response.status === 204 || response.ok) { ... }

        this.showMessage("O'quvchi guruhdan muvaffaqiyatli olib tashlandi", 'success');
        // Jadvalni yangilash
        // await this.fetchAssignedStudents(this.selectedGroup); // Yoki lokal ro'yxatdan o'chirish
        this.assignedStudents = this.assignedStudents.filter(s => s.id !== studentId);

      } catch (error) {
        console.error("O'quvchini guruhdan olib tashlashda xatolik:", error);
        this.showMessage(`O'chirishda xatolik: ${error.message}`, 'error');
      } finally {
        this.loading.removal = null; // O'chirish jarayoni tugadi
      }
    },

    // Xabarni ko'rsatish va stil berish
    showMessage(text, type = 'info') {
      this.message = text;
      if (type === 'error') {
        this.messageClass = 'bg-red-100 text-red-700 border border-red-300';
      } else if (type === 'success') {
        this.messageClass = 'bg-green-100 text-green-700 border border-green-300';
      } else if (type === 'warning') {
         this.messageClass = 'bg-yellow-100 text-yellow-700 border border-yellow-300';
      } else {
        this.messageClass = 'bg-blue-100 text-blue-700 border border-blue-300'; // info uchun
      }

      // Xabarni 5 sekunddan keyin yo'qotish (ixtiyoriy)
      // setTimeout(() => {
      //   if (this.message === text) { // Agar orada boshqa xabar chiqmagan bo'lsa
      //      this.message = '';
      //   }
      // }, 5000);
    }
  }
}
</script>

<style scoped>
/* Agar 'warning' klassi uchun Tailwind da tayyor ranglar bo'lmasa, o'zingiz qo'shishingiz mumkin */
/* .bg-yellow-100 { background-color: #fffbeb; } */
/* .text-yellow-700 { color: #b45309; } */
/* .border-yellow-300 { border-color: #fcd34d; } */

/* Select elementlari disabled bo'lganda ko'rinishini yaxshilash */
select:disabled {
  cursor: not-allowed;
  background-color: #f3f4f6; /* gray-100 */
}
</style>