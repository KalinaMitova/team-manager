handlers.detailsController = function (ctx) {
    ctx.teamId = ctx.params.teamId.substring(1);
    ctx.loggedIn = true;
    ctx.username = auth.isAuthed().username;
    ctx.hasTeam = auth.isAuthed().teamId === undefined;
    ctx.isOnTeam = auth.isAuthed().teamId === ctx.teamId;

    Promise.all([teamsService.loadTeamDetails(ctx.teamId), teamsService.getTeamMembers(ctx.teamId)])
        .then(([team, members]) => {
            ctx.name = team.name;
            ctx.comment = team.comment;
            ctx.isAuthor = team._acl.creator === auth.isAuthed().userId;
            ctx.isNotAuthor = team._acl.creator !== auth.isAuthed().userId;
            ctx.members = members;
            ctx.loadPartials({
                header: './templates/common/header.hbs',
                footer: './templates/common/footer.hbs',
                teamMember: './templates/catalog/teamMember.hbs',
                teamControls: './templates/catalog/teamControls.hbs'
            }).then(function () {
                ctx.partials = this.partials;
                this.partial('./templates/catalog/details.hbs');
            })
        }).catch(auth.catchError);
}
