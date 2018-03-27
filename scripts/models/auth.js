let auth = (() => {
    function saveSession(userInfo) {
        let userAuth = userInfo._kmd.authtoken;
        sessionStorage.setItem('authtoken', userAuth);
        let userId = userInfo._id;
        sessionStorage.setItem('userId', userId);
        let username = userInfo.username;
        sessionStorage.setItem('username', username);
        sessionStorage.setItem('teamId', userInfo.teamId);
    }

    function clearStorage() {
      sessionStorage.clear();
    }

    function isAuthed() {

        return sessionStorage.getItem('authtoken') !== null
            ? {username: sessionStorage.getItem("username"),
                userId: sessionStorage.getItem('userId'),
                teamId: sessionStorage.getItem('teamId')}
            : false ;
    }

    // user/login
    function login(username, password) {
        let userData = {
            username,
            password
        };

        return requester.post('user', 'login', 'basic', userData);
    }

    // user/register
    function register(username, password, repeatPassword) {
        let userData = {
            username,
            password
        };

        return requester.post('user', '', 'basic', userData);
    }

    // user/logout
    function logout() {
        let logoutData = {
            authtoken: sessionStorage.getItem('authtoken')
        };

        return requester.post('user', '_logout', 'kinvey', logoutData);
    }

    function handleError(reason) {
        showError(reason.responseJSON.description);
    }

    function showInfo(message) {
        let infoBox = $('#infoBox');
        infoBox.text(message);
        infoBox.show();
        setTimeout(() => infoBox.fadeOut(), 3000);
    }

    function showError(message) {
        let errorBox = $('#errorBox');
        errorBox.text(message);
        errorBox.show();
        setTimeout(() => errorBox.fadeOut(), 3000);
    }

    function catchError(err) {
        let message ='';
        if(err){
            if(err.responseJSON){
                message = err.responseJSON.description;
            }else{
                message = err.message;
            }
            auth.showError(message)
        }
    }

    return {
        login,
        register,
        logout,
        saveSession,
        clearStorage,
        isAuthed,
        showInfo,
        showError,
        handleError,
        catchError
    }
})()