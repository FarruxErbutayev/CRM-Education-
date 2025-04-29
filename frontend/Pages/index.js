import { createRouter, createWebHashHistory } from "vue-router";
import login from "../src/admin/login.vue";
import welcome from "../src/userapeal.vue";
// import user from "../src/dashboard.vue";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: "/login", component: login },
    { path: "/welcome", component: welcome },
    // { path: "/user", component: dashtboard },
  
    
    {
      path: "/",
      component: () => import("../src/admin/dashtboard.vue"),
      children: [
        {
          path: "editprofil",
          component: () => import("../src/admin/Editprofil.vue"),
        },
        {
          path: "allApeals",
          component: () => import("../src/admin/Apeal.vue"),
        },
        {
          path: "kalindar",
          component: () => import("../src/admin/Kundalik/Calendar.vue"),
        },
        {
          path: "Kalendar",
          component: () => import("../src/admin/Kundalik/Calendar.vue"),
        },

        {
          path: "changepassword",
          component: () => import("../src/admin/changepassword.vue"),
        },
        {
          path: "",
          component: () => import("../src/admin/Notification.vue"),
        },
        {
          path: "notification_apeal",
          component: () => import("../src/admin/Notification_apeal.vue"),
        },
        {
          path: "kurslar r",
          component: () => import("../src/admin/courses/add.vue"),
        },
        {
          path: "kurslar",
          component: () => import("../src/admin/courses/course.vue"),
        },

        {
          path: "korzinka",
          component: () => import("../src/admin/Corzina.vue"),
        },
        {
          path: "ota-onalar",
          component: () => import("../parents/login.vue"),
        },

        
        {
          path: "teachers-list",
          component: () => import("../src/admin/teachers/index.vue"),
        },
        
       
        {
          path: "addteacher",
          component: () => import("../src/admin/teachers/add.vue"),
        },
        {
          path: "pupils",
          component: () => import("../src/Pupils/pupils.vue"),
        },
        {
          path: "addpupil",
          component: () => import("../src/Pupils/add.vue"),
        },
        {
          path: "guruh yaratish",
          component: () => import("../src/groups/group1.vue"),
        },
        {
          path: "guruh royxati",
          component: () => import("../src/groups/groupList.vue"),
        },
        {
          path: "guruhga qo`shish",
          component: () => import("../src/groups/students.vue"),
        },
        {
          path: "guruhga biriktirilganlar",
          component: () => import("../src/groups/sgroup.vue"),
        },
       

        {
          // path: "addschedule",
          path: "dars tuzish",
          // component: () => import("../src/schedule/ScheduleView.vue"),
          component: () => import("../src/schedule/addschedules.vue"),
        },
        {
          // path: "addschedule",
          path: "dars jadvali",
          // component: () => import("../src/schedule/ScheduleView.vue"),
          component: () => import("../src/schedule/getSchedule.vue"),
        },
        // {
        //   path: "ota onalar",
        //   component: () => import("../src/parents/login.vue"),
        // },
        {
          path: "Qarzdorlar",
          component: () => import("../payment/pay.vue"),
        },
        {
          path: "Payment",
          component: () => import("../payment/Payment Qr.vue"),
        },
        // {
        //   path: "kalindar",
        //   component: () => import("..src/admin/modals/addcalendar.vue"),
        // },
        {
          path: "/markaz",
          component: ()=>import("../src/about/markaz.vue"),
        },
        {
          path: "/student",
       
        component: ()=>import("../src/User/studentDashboard.vue"),
      },
      {
        path:"/Teacherpage",
        component: () => import("../src/TeacherPage/TeacherDashboard.vue"),
      }


      ],
    },
  ],
});

export default router;
