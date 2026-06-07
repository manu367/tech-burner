export default class SessionModel {
    constructor({
        id = null,
        userId = "",
        token = "",
        loginTime = Date.now(),
        expireTime = "",
        isActive = true
    }) {
        this.id = id;
        this.userId = userId;
        this.token = token;
        this.loginTime = loginTime;
        this.expireTime = expireTime;
        this.isActive = isActive;
    }
}