handlers.homeController = function (ctx) {
    if (auth.isAuthed()) {
        ctx.loggedIn = true;
        ctx.username = auth.isAuthed().username;
        ctx.hasTeam = auth.isAuthed().teamId in window ? false : true;
        ctx.teamId = auth.isAuthed().teamId;
    }

    ctx.loadPartials({
        header: './templates/common/header.hbs',
        footer: './templates/common/footer.hbs'
    }).then(function () {
        ctx.partials = this.partials;
        ctx.partial('./templates/home/home.hbs');
    })
};
