const faker = require('faker');
const uuid = require('uuid');
const fs = require('fs');

faker.seed(1000);

function rand(min, max) {
    min = Math.round(min);
    max = Math.round(max);
    return Math.floor(Math.random() * (max - min + min)) + min;
}

let accounts = [],
    users = [],
    projects = [],
    assets = [];

for (let a = 1, minUser = 0; a <= 10; a++) {
    let account = {
        id: a,
        added: faker.date.past(2),
        modified: null,
        company: faker.company.companyName()
    };
    accounts.push(account);

    let userCount = rand(minUser+1, minUser+5);
    for (let u = minUser; u <= userCount; u++) {
        let user = {
            id: u,
            account_id: account.id,
            added: faker.date.past(1),
            modified: null,
            first_name: faker.name.firstName(),
            last_name: faker.name.lastName()
        };
        users.push(user);
        minUser = u;

        let projectCount = rand(0, 5);
        if (projectCount) {
            let project = {
                id: uuid.v4(),
                account_id: account.id,
                user_id: rand(1, userCount),
                added: faker.date.recent(180),
                modified: (rand(0, 10) > 7 ? faker.date.recent(30) : null),
                title: faker.lorem.words(rand(2, 8))
            };
            projects.push(project);

            let assetCount = rand(0, 3);
            if (assetCount) {
                let asset = {
                    id: uuid.v4(),
                    account_id: account.id,
                    user_id: rand(1, userCount),
                    project_id: project.id,
                    added: faker.date.recent(180),
                    modified: (rand(0, 10) > 7 ? faker.date.recent(30) : null),
                    filename: faker.system.fileName()
                };
                assets.push(asset);
            }
        }
    }
}

['accounts', 'users', 'projects', 'assets'].forEach(function(which) {
    let whichText = `let ${which} = ` + JSON.stringify(eval(which), null, 4) + `;\n\nmodule.exports = ${which};\n`;
    fs.writeFile(`${__dirname}/../mock/${which}-data.js`, whichText, function (err, data) {
        if (err) {
            console.log(err);
        } else {
            console.log(`Written ${which}-data.js`);
        }
    });
});
