import teacherauth from "./auth/index.js";
import change_password from "./profil/change pasword.js";
import change_photos from "./profil/change photos.js";
import getprofil from "./profil/getprofil.js";
import logout from "./profil/logout.js";
import teacheradd from "./teachers/teacheradd.js";
import getTeachers from "./teachers/getTeachers.js";

export default [
    { path: "/teacherAuth", route: teacherauth },
    { path: "/changePassword", route: change_password },
    { path: "/changePhotos", route: change_photos },
    { path: "/getProfile", route: getprofil },
    { path: "/logout", route: logout },
    { path: "/add", route: teacheradd },
    { path: "/getTeachers", route: getTeachers }
];
