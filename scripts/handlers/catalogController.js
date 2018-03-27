handlers.catalogController = function (ctx) {
    ctx.loggedIn = true;
    ctx.username = auth.isAuthed().username;
    ctx.hasNoTeam = auth.isAuthed().teamId in window ? true : false;

    teamsService.loadTeams()
        .then(data => {
            ctx.teams = data;

            this.loadPartials({
                header: './templates/common/header.hbs',
                footer: './templates/common/footer.hbs',
                team: './templates/catalog/team.hbs'
            })
                .then(function () {
                    this.partial('./templates/catalog/teamCatalog.hbs');
                })
        }).catch(auth.catchError);
}
