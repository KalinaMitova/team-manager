handlers.editController = function (ctx) {
    ctx.loggedIn = true;
    ctx.username = auth.isAuthed().username;

    let teamId = ctx.params.teamId.substring(1);
    teamsService.loadTeamDetails(teamId)
        .then(team => {
            ctx.name = team.name;
            ctx.comment = team.comment;

            ctx.loadPartials({
                header: './templates/common/header.hbs',
                footer: './templates/common/footer.hbs',
                editForm: './templates/edit/editForm.hbs',
            }).then(function () {
                ctx.partials = this.partials;
                ctx.partial('./templates/edit/editPage.hbs');
            })
        })
        .catch(auth.catchError)
};
