const faker = require("faker");
const uuid = require("uuid");
const fs = require("fs");

faker.seed(1000);

function rand(min, max) {
  min = Math.round(min);
  max = Math.round(max);
  return Math.floor(Math.random() * (max - min + min)) + min;
}

let accounts = [];

let users = [];

let projects = [];

let assets = [];

let accountUsers = [];

for (let a = 1, uCount = 1; a <= 10; a++) {
  let account = {
    id: a,
    added: faker.date.past(2),
    modified: null,
    company: faker.company.companyName()
  };
  accounts.push(account);
  accountUsers[a] = [];

  let userCount = rand(1, 7);
  for (let u = 1; u <= userCount; u++, uCount++) {
    let user = {
      id: uCount,
      account_id: account.id,
      added: faker.date.past(1),
      modified: null,
      first_name: faker.name.firstName(),
      last_name: faker.name.lastName()
    };
    users.push(user);
    accountUsers[a].push(uCount);
  }
}

for (let a = 1; a < accountUsers.length; a++) {
  let projectCount = rand(0, 5);
  if (projectCount) {
    for (let p = 1; p <= projectCount; p++) {
      let project = {
        id: uuid.v4(),
        account_id: a,
        user_id:
          accountUsers[a][Math.floor(Math.random() * accountUsers[a].length)],
        added: faker.date.recent(180),
        modified: rand(0, 10) > 7 ? faker.date.recent(30) : null,
        title: faker.lorem.words(rand(2, 8))
      };
      projects.push(project);
    }
  }
}

for (let p = 1; p < projects.length; p++) {
  let assetCount = rand(0, 5);
  if (assetCount) {
    for (let ac = 1; ac <= assetCount; ac++) {
      let asset = {
        id: uuid.v4(),
        account_id: projects[p].account_id,
        user_id:
          accountUsers[projects[p].account_id][
            Math.floor(
              Math.random() * accountUsers[projects[p].account_id].length
            )
          ],
        project_id: projects[p].id,
        added: faker.date.recent(180),
        modified: rand(0, 10) > 7 ? faker.date.recent(30) : null,
        filename: faker.system.fileName()
      };
      assets.push(asset);
    }
  }
}

["accounts", "users", "projects", "assets"].forEach(function(which) {
  let whichText =
    `let ${which} = ` +
    JSON.stringify(eval(which), null, 4) +
    `;\n\nmodule.exports = ${which};\n`;
  fs.writeFile(`${__dirname}/../mock/${which}-data.js`, whichText, function(
    err,
    data
  ) {
    if (err) {
      console.log(err);
    } else {
      console.log(`Written ${which}-data.js`);
    }
  });
});
