export default () => {
  let employee = {};
  let loggedInUser = {};
  const topImage = 'url(https://source.unsplash.com/category/nature/800x500)';

  return {
    setLoggedInUser: (user) => {
      loggedInUser = user;
    },
    getLoggedInUser: () => loggedInUser,
    setEmployee: (data) => {
      employee = data;
      // var name = data.first_name + data.last_name;
      // var imageName = name.replace(/-/g, '').toLowerCase();
      // topImage = `url(http://blankoslo.no/img/${imageName}.jpg)`;
    },
    getEmployee: () => employee,
    getTopImage: () => topImage
  };
};
