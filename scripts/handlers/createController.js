handlers.createController =  function (ctx) {
    let name = ctx.params.name;
    let comment = ctx.params.comment;

    if (name.length === 0) {
        auth.showError('Error: Name can not be empty');
        return;
    }

    teamsService.createTeam(name, comment)
        .then(team => {
            auth.showInfo(`Successfully created the team "${team.name}"`);
            teamsService.joinTeam(team._id)
                .then(user => {
                    "use strict";
                    sessionStorage.setItem('teamId', user.teamId);
                    ctx.redirect(`#/catalog/:${user.teamId}`);
                }).catch(auth.catchError);
        }).catch(auth.catchError);
}