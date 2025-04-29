<template>
    <div class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div class="max-w-5xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div class="p-8">
          <div class="text-center mb-8">
            <h1 class="text-2xl font-bold text-gray-900">Guruhga biriktirilgan o'quvchilar ro'yxati</h1>
            <p class="mt-2 text-sm text-gray-600">Guruhni tanlang va unga biriktirilgan o'quvchilarni ko'ring</p>
          </div>
  
          <!-- Xabar ko'rsatish -->
          <div v-if="message" :class="['p-4 mb-6 rounded-md', messageClass]">
            <p>{{ message }}</p>
          </div>
  
          <!-- Guruh tanlash -->
          <div class="mb-8">
            <label for="group" class="block text-sm font-medium text-gray-700 mb-2">Guruh</label>
            <div class="relative">
              <select
                id="group"
                v-model="selectedGroup"
                @change="fetchStudentsInGroup"
                class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm rounded-md"
                :disabled="loading.groups"
              >
                <option value="" disabled>Guruhni tanlang</option>
                <option v-for="group in groups" :key="group.id" :value="group.id">
                  {{ group.group_name }}
                </option>
              </select>
              <div v-if="loading.groups" class="absolute inset-y-0 right-0 flex items-center pr-3">
                <svg class="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            </div>
          </div>
  
          <!-- Qidiruv va filtrlash -->
          <div class="mb-6 flex flex-col sm:flex-row gap-4">
            <div class="relative flex-grow">
              <input
                type="text"
                v-model="searchQuery"
                placeholder="O'quvchi ismini qidirish..."
                class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
              />
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
                </svg>
              </div>
            </div>
            <div>
              <select
                v-model="sortBy"
                class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm rounded-md"
              >
                <option value="name">Ism bo'yicha saralash</option>
                <option value="id">ID bo'yicha saralash</option>
                <option value="date">Sana bo'yicha saralash</option>
              </select>
            </div>
          </div>
  
          <!-- O'quvchilar jadvali -->
          <div class="overflow-x-auto">
            <table v-if="selectedGroup && filteredStudents.length > 0" class="min-w-full divide-y divide-gray-200 border">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ism</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telefon</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Biriktirilgan sana</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Holati</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="student in filteredStudents" :key="student.id" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ student.id }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="h-10 w-10 flex-shrink-0">
                        <div class="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800 font-semibold">
                          {{ getInitials(student.firstname, student.lastname) }}
                        </div>
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">{{ student.firstname }} {{ student.lastname }}</div>
                        <div class="text-sm text-gray-500">{{ student.email || 'Email mavjud emas' }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ student.phone || 'Telefon mavjud emas' }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(student.assigned_date) }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="[
                      'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                      student.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    ]">
                      {{ student.status === 'active' ? 'Faol' : 'Nofaol' }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
  
            <!-- Ma'lumot yo'q holatlar -->
            <div v-else-if="selectedGroup && !loading.students && filteredStudents.length === 0" class="text-center py-12 bg-white border rounded-md">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 class="mt-2 text-sm font-medium text-gray-900">O'quvchilar topilmadi</h3>
              <p class="mt-1 text-sm text-gray-500">Bu guruhda hali o'quvchilar yo'q yoki qidiruv bo'yicha natija topilmadi.</p>
            </div>
  
            <div v-else-if="!selectedGroup" class="text-center py-12 bg-white border rounded-md">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 class="mt-2 text-sm font-medium text-gray-900">Guruh tanlanmagan</h3>
              <p class="mt-1 text-sm text-gray-500">O'quvchilar ro'yxatini ko'rish uchun guruhni tanlang.</p>
            </div>
  
            <div v-else-if="loading.students" class="text-center py-12 bg-white border rounded-md">
              <svg class="mx-auto h-12 w-12 text-gray-400 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <h3 class="mt-2 text-sm font-medium text-gray-900">Ma'lumotlar yuklanmoqda</h3>
              <p class="mt-1 text-sm text-gray-500">Iltimos, kuting...</p>
            </div>
          </div>
  
          <!-- Pagination -->
          <div v-if="selectedGroup && filteredStudents.length > 0" class="mt-6 flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
            <div class="flex flex-1 justify-between sm:hidden">
              <button
                @click="currentPage > 1 ? currentPage-- : null"
                :disabled="currentPage === 1"
                class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Oldingi
              </button>
              <button
                @click="currentPage < totalPages ? currentPage++ : null"
                :disabled="currentPage === totalPages"
                class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Keyingi
              </button>
            </div>
            <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p class="text-sm text-gray-700">
                  <span>Jami</span>
                  <span class="font-medium">{{ totalItems }}</span>
                  <span>ta o'quvchidan</span>
                  <span class="font-medium">{{ (currentPage - 1) * pageSize + 1 }}</span>
                  <span>dan</span>
                  <span class="font-medium">{{ Math.min(currentPage * pageSize, totalItems) }}</span>
                  <span>gacha ko'rsatilmoqda</span>
                </p>
              </div>
              <div>
                <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                  <button
                    @click="currentPage > 1 ? currentPage-- : null"
                    :disabled="currentPage === 1"
                    class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                  >
                    <span class="sr-only">Oldingi</span>
                    <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fill-rule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clip-rule="evenodd" />
                    </svg>
                  </button>
                  <button
                    v-for="page in displayedPages"
                    :key="page"
                    @click="currentPage = page"
                    :class="[
                      'relative inline-flex items-center px-4 py-2 text-sm font-semibold',
                      page === currentPage
                        ? 'z-10 bg-emerald-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600'
                        : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                    ]"
                  >
                    {{ page }}
                  </button>
                  <button
                    @click="currentPage < totalPages ? currentPage++ : null"
                    :disabled="currentPage === totalPages"
                    class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                  >
                    <span class="sr-only">Keyingi</span>
                    <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
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
        groups: [],
        students: [],
        selectedGroup: '',
        searchQuery: '',
        sortBy: 'name',
        currentPage: 1,
        pageSize: 10,
        loading: {
          groups: false,
          students: false
        },
        message: '',
        messageClass: '',
        apiBaseUrl: 'http://localhost:4100/'
      }
    },
    computed: {
      filteredStudents() {
        let result = [...this.students];
        
        // Qidiruv
        if (this.searchQuery) {
          const query = this.searchQuery.toLowerCase();
          result = result.filter(student => 
            (student.firstname && student.firstname.toLowerCase().includes(query)) || 
            (student.lastname && student.lastname.toLowerCase().includes(query)) ||
            (student.id && student.id.toString().includes(query))
          );
        }
        
        // Saralash
        if (this.sortBy === 'name') {
          result.sort((a, b) => (a.firstname + ' ' + a.lastname).localeCompare(b.firstname + ' ' + b.lastname));
        } else if (this.sortBy === 'id') {
          result.sort((a, b) => a.id - b.id);
        } else if (this.sortBy === 'date') {
          result.sort((a, b) => new Date(b.assigned_date) - new Date(a.assigned_date));
        }
        
        // Pagination uchun
        const startIndex = (this.currentPage - 1) * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        
        return result.slice(startIndex, endIndex);
      },
      totalItems() {
        return this.students.length;
      },
      totalPages() {
        return Math.ceil(this.totalItems / this.pageSize);
      },
      displayedPages() {
        const pages = [];
        const maxPagesToShow = 5;
        
        if (this.totalPages <= maxPagesToShow) {
          // Agar sahifalar soni kam bo'lsa, hammasini ko'rsatamiz
          for (let i = 1; i <= this.totalPages; i++) {
            pages.push(i);
          }
        } else {
          // Aks holda, joriy sahifa atrofidagi sahifalarni ko'rsatamiz
          let startPage = Math.max(1, this.currentPage - Math.floor(maxPagesToShow / 2));
          let endPage = startPage + maxPagesToShow - 1;
          
          if (endPage > this.totalPages) {
            endPage = this.totalPages;
            startPage = Math.max(1, endPage - maxPagesToShow + 1);
          }
          
          for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
          }
        }
        
        return pages;
      }
    },
    mounted() {
      this.fetchGroups();
    },
    methods: {
      // Guruhlarni yuklash
      async fetchGroups() {
        this.loading.groups = true;
        try {
          const response = await fetch(`${this.apiBaseUrl}groups/getGroups`);
          if (!response.ok) throw new Error('Guruhlarni yuklashda xatolik yuz berdi');
          
          const data = await response.json();
          this.groups = data;
        } catch (error) {
          console.error('Error fetching groups:', error);
          this.showMessage('Guruhlarni yuklashda xatolik yuz berdi', 'error');
        } finally {
          this.loading.groups = false;
        }
      },
      
      // Guruhdagi o'quvchilarni yuklash
      async fetchStudentsInGroup() {
        if (!this.selectedGroup) return;
        
        this.loading.students = true;
        this.students = [];
        this.currentPage = 1;
        
        try {
          // API manzilini o'z serveringizga moslashtiring
          const response = await fetch(`${this.apiBaseUrl}groups/${this.selectedGroup}/students`);
          if (!response.ok) throw new Error('Guruhdagi o\'quvchilarni yuklashda xatolik yuz berdi');
          
          const data = await response.json();
          this.students = data;
        } catch (error) {
          console.error('Error fetching students in group:', error);
          this.showMessage('Guruhdagi o\'quvchilarni yuklashda xatolik yuz berdi', 'error');
        } finally {
          this.loading.students = false;
        }
      },
      
      // Xabar ko'rsatish
      showMessage(text, type) {
        this.message = text;
        this.messageClass = type === 'error' 
          ? 'bg-red-50 text-red-700 border border-red-200' 
          : 'bg-green-50 text-green-700 border border-green-200';
        
        // 5 sekunddan keyin xabarni o'chirish
        setTimeout(() => {
          this.message = '';
        }, 5000);
      },
      
      // Ismning bosh harflarini olish
      getInitials(firstname, lastname) {
        const first = firstname ? firstname.charAt(0).toUpperCase() : '';
        const last = lastname ? lastname.charAt(0).toUpperCase() : '';
        return first + last;
      },
      
      // Sanani formatlash
      formatDate(dateString) {
        if (!dateString) return 'Sana mavjud emas';
        
        try {
          const date = new Date(dateString);
          return new Intl.DateTimeFormat('uz-UZ', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          }).format(date);
        } catch (error) {
          return dateString;
        }
      }
    },
    watch: {
      searchQuery() {
        this.currentPage = 1; // Qidiruv o'zgarganda birinchi sahifaga qaytish
      },
      sortBy() {
        this.currentPage = 1; // Saralash o'zgarganda birinchi sahifaga qaytish
      }
    }
  }
  </script>