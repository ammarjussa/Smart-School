class Profile {
    constructor() {
      this.email = '';
    }

    updateEmail(email) {
        this.email = email
    }
  
    getEmail() {
        return this.email
    }
  }
  
  export default new Profile();
  