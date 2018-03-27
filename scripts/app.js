const handlers = {};
$(() => {
    const app = Sammy('#main', function () {
        this.use('Handlebars', 'hbs');

        this.get('#/home', handlers.homeController);

        this.get('index.html', function (ctx) {
            ctx.redirect('#/home')
        });

        this.get('#/register', function () {
            this.loadPartials({
                header: './templates/common/header.hbs',
                footer: './templates/common/footer.hbs',
                registerForm: './templates/register/registerForm.hbs'
            }).then(function () {
                this.partial('./templates/register/registerPage.hbs');
            })
        });

        this.post('#/register', handlers.registerController);

        this.get('#/login', function () {
            this.loadPartials({
                header: './templates/common/header.hbs',
                footer: './templates/common/footer.hbs',
                loginForm: './templates/login/loginForm.hbs'
            }).then(function () {
                this.partial('./templates/login/loginPage.hbs')
            })
        });

        this.post('#/login', handlers.loginController);

        this.get('#/about', function () {
            if (auth.isAuthed()) {
                this.loggedIn = true;
                this.username = auth.isAuthed().username;
            }
            this.loadPartials({
                header: './templates/common/header.hbs',
                footer: './templates/common/footer.hbs'
            }).then(function () {
                this.partial('./templates/about/about.hbs')
            })
        })

        this.get('#/catalog', handlers.catalogController);

        this.get('#/catalog/:teamId', handlers.detailsController);

        this.get('#/logout', function (ctx) {
            console.log('Logout');
            auth.logout()
                .then(() => {
                    sessionStorage.clear();
                    ctx.loggedIn = false;
                    this.redirect('#/home');
                    auth.showInfo('successfully logged out');
                }).catch(auth.catchError);
        });

        this.get('#/join/:teamId', function (ctx) {
            let teamId = ctx.params.teamId.substring(1);
            Promise.all([teamsService.loadTeamDetails(teamId), teamsService.joinTeam(teamId)])
                .then(([team, user]) => {
                    auth.showInfo(`${user.username} successsfully joined the team "${team.name}"`);
                    sessionStorage.setItem('teamId', teamId)
                    ctx.redirect(`#/catalog/:${teamId}`)
                }).catch(auth.catchError)
        });

        this.get('#/leave', function (ctx) {
            let teamId = auth.isAuthed().teamId;
            Promise.all([teamsService.loadTeamDetails(teamId), teamsService.leaveTeam(teamId)])
                .then(([team, user]) => {
                    auth.showInfo(`${user.username} successsfully leaved the team "${team.name}"`);
                    sessionStorage.setItem('teamId', user.teamId);
                    ctx.redirect(`#/catalog/:${teamId}`)
                }).catch(auth.catchError)
        });

        this.get('#/create', function (ctx) {
            ctx.loggedIn = true;
            ctx.username = auth.isAuthed().username;
            ctx.loadPartials({
                header: './templates/common/header.hbs',
                footer: './templates/common/footer.hbs',
                createForm: './templates/create/createForm.hbs'
            }).then(function () {
                ctx.partials = this.partials;
                ctx.partial('./templates/create/createPage.hbs')
            })
        });

        this.post('#/create',handlers.createController);

        this.get('#/edit/:teamId', handlers.editController);

        this.post('#/edit/:teamId', function (ctx) {
            let name = ctx.params.name;
            let comment = ctx.params.comment;
            let teamId = location.hash.substring(8);

            teamsService.edit(teamId, name, comment)
                .then(team => {
                    auth.showInfo(`Successfully edited team ${team.name}`);
                    ctx.redirect(`#/catalog/:${team._id}`);
                })
                .catch(auth.catchError);
        });
    });

    app.run();
});