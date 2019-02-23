class Validator {

  validatePhone (phone) {
    return phone.split('-').join('').split(' ').join('').split('(').join('').split(')').join('');
  }
  validateAddress (address) {
    if(!address) return false;
    return address.length >= 6 && address.length <= 300;
  }
  validateName (name) {
    let nameRegex = /^(?=.{4,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/;
    return nameRegex.test(name);
  }
  validatePhoto (photo) {

  }
  validateRating (rating) {
    return Number.isInteger(parseInt(rating)) && rating >= 1 && rating <= 5;
  }
}
module.exports = new Validator;
