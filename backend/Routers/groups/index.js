import addGroup from "./addGroup.js";
import addStudentsToGroup from "./addStudentsToGroup.js";
import getGroups from "./getGroups.js";

export default [
    { path: "/addGroup", route: addGroup },
    { path: "/addStudentsToGroup", route: addStudentsToGroup },
    { path: "/getGroups", route: getGroups }
];

