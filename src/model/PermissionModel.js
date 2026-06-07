export default class PermissionModel {
    constructor({
        userId = "",
        role = "student",
        canCreateCourse = false,
        canEditCourse = false,
        canDeleteCourse = false,
        canManageUsers = false
    }) {
        this.userId = userId;
        this.role = role;
        this.canCreateCourse = canCreateCourse;
        this.canEditCourse = canEditCourse;
        this.canDeleteCourse = canDeleteCourse;
        this.canManageUsers = canManageUsers;
    }
}