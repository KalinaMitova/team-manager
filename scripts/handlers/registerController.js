handlers.registerController = function (context) {
    let username = context.params.username;
    let password = context.params.password;
    let confirmPassword = context.params.repeatPassword;

    if (username.length === 0) {
        auth.showError('Error: Username can not be empty');
        return;
    }
    if (password.length === 0) {
        auth.showError('Error: Password can not be empty');
        return;
    }
    if (confirmPassword.length === 0) {
        auth.showError('Error: Please repeat your password');
        return;
    }

    if (confirmPassword !== password) {
        auth.showError('The passwords don`t much');
        return;
    }
    auth.register(username, password)
        .then(function (data) {
            auth.saveSession(data);
            context.loggedIn = true;
            context.username = username;
            context.redirect('#/home');
            auth.showInfo('Successfully registered')
        })
        .catch(auth.catchError)
    ;
}