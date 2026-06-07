export default class UserModel {
    constructor({
        id = null,
        name = "",
        email = "",
        mobile = "",
        profileImage = "",
        role = "student",
        status = "active",
        createdAt = Date.now()
    }) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.mobile = mobile;
        this.profileImage = profileImage;
        this.role = role;
        this.status = status;
        this.createdAt = createdAt;
    }
}