handlers.loginController = function (context) {
    let username = context.params.username;
    let password = context.params.password;

    if (username.length === 0) {
        auth.showError('Error: Username can not be empty');
        return;
    }
    if (password.length === 0) {
        auth.showError('Error: Password can not be empty');
        return;
    }

    auth.login(username, password)
        .then(function (data) {
            auth.saveSession(data);
            context.redirect('#/home');
            auth.showInfo('Successfully logged in')
        })
        .catch(auth.catchError);
}
