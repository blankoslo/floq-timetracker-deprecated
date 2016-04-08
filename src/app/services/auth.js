export default () => {
    var loggedInUser = {};
    var employee = {};

    return {
        setLoggedInUser: (data) => {
            loggedInUser = data;
        },
        setEmployee: (data) => {
            employee = data;
        },
        getEmployee: () => {
            return employee;
        }
    }
}
