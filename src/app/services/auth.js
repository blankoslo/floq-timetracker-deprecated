export default () => {
  var loggedInUser = {};
  var employee = {};
  var topImage = "url(https://source.unsplash.com/category/nature/800x500)";

  return {
    setLoggedInUser: (data) => {
      loggedInUser = data;
    },
    setEmployee: (data) => {
      employee = data;
      var name = data.first_name + data.last_name
      var imageName = name.replace(/-/g, '').toLowerCase();
      //topImage = `url(http://blankoslo.no/img/${imageName}.jpg)`;
    },
    getEmployee: () => {
      return employee;
    },
    getTopImage: () => {
      return topImage;
    }
  }
}