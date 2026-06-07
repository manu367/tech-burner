export default class AdminModel {
    constructor({
        id = null,
        name = "",
        email = "",
        mobile = "",
        permissions = [],
        status = "active",
        createdAt = Date.now()
    }) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.mobile = mobile;
        this.permissions = permissions;
        this.status = status;
        this.createdAt = createdAt;
    }
}