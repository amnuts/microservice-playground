const axios = require('axios');
const graphql = require('graphql');
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull
} = graphql;
const urls = require('./urls');

const AccountType = new GraphQLObjectType({
    name: 'Account',
    fields: () => ({
        id: { type: GraphQLInt },
        added: { type: GraphQLString },
        modified: { type: GraphQLString },
        company: { type: GraphQLString },
        users: {
            type: new GraphQLList(UserType),
            resolve(parent, args){
                return axios.get(`${urls.users}/${parent.id}`)
                    .then(function (response) {
                        return response.data;
                    }).catch(function (error) {
                        console.log(error);
                    });
            }
        }
    })
});

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: GraphQLInt },
        account_id: { type: GraphQLInt },
        added: { type: GraphQLString },
        modified: { type: GraphQLString },
        first_name: { type: GraphQLString },
        last_name: { type: GraphQLString },
        projects: {
            type: new GraphQLList(ProjectType),
            resolve(parent, args){
                console.log(parent);
                return axios.get(`${urls.projects}/${parent.account_id}/user/${parent.id}`)
                    .then(function (response) {
                        return response.data;
                    }).catch(function (error) {
                        console.log(error);
                    });
            }
        }
    })
});

const ProjectType = new GraphQLObjectType({
    name: 'Project',
    fields: () => ({
        id: { type: GraphQLID },
        account_id: { type: GraphQLInt },
        user_id: { type: GraphQLInt },
        added: { type: GraphQLString },
        modified: { type: GraphQLString },
        title: { type: GraphQLString },
        user: {
            type: UserType,
            resolve(parent, args){
                // go to web service to get details
                // use parent.id for user id or
                // parent.accountId for account id
                return null;
            }
        },
        assets: {
            type: new GraphQLList(AssetType),
            resolve(parent, args){
                // go to web service to get details
                // use parent.id for user id or
                // parent.accountId for account id
                return null;
            }
        }
    })
});

const AssetType = new GraphQLObjectType({
    name: 'Asset',
    fields: () => ({
        id: { type: GraphQLID },
        account_id: { type: GraphQLInt },
        user_id: { type: GraphQLInt },
        added: { type: GraphQLString },
        modified: { type: GraphQLString },
        filename: { type: GraphQLString },
        user: {
            type: UserType,
            resolve(parent, args){
                // go to web service to get details
                // use parent.id for user id or
                // parent.accountId for account id
                return null;
            }
        },
        project: {
            type: ProjectType,
            resolve(parent, args){
                // go to web service to get details
                // use parent.id for user id or
                // parent.accountId for account id
                return null;
            }
        }
    })
});


const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        account: {
            type: AccountType,
            args: { id: { type: GraphQLInt } },
            resolve(parent, args) {
                return axios.get(`${urls.accounts}/${args.id}`)
                    .then(function (response) {
                        return response.data;
                    }).catch(function (error) {
                        console.log(error);
                    });
            }
        },
        accounts: {
            type: new GraphQLList(AccountType),
            resolve(parent, args) {
                return axios.get(urls.accounts)
                    .then(function (response) {
                        return response.data;
                    }).catch(function (error) {
                        console.log(error);
                    });
            }
        },
        user: {
            type: UserType,
            args: { account_id: {type: GraphQLInt}, id: { type: GraphQLInt } },
            resolve(parent, args){
                return axios.get(`${urls.users}/${args.account_id}/${args.id}`)
                    .then(function (response) {
                        return response.data;
                    }).catch(function (error) {
                        console.log(error);
                    });
            }
        },
        users: {
            type: new GraphQLList(UserType),
            args: { account_id: {type: GraphQLInt} },
            resolve(parent, args){
                return axios.get(`${urls.users}/${args.account_id}`)
                    .then(function (response) {
                        return response.data;
                    }).catch(function (error) {
                        console.log(error);
                    });
            }
        },
        project: {
            type: ProjectType,
            args: { account_id: {type: GraphQLInt}, id: { type: GraphQLID } },
            resolve(parent, args){
                return axios.get(`${urls.projects}/${args.account_id}/${args.id}`)
                    .then(function (response) {
                        return response.data;
                    }).catch(function (error) {
                        console.log(error);
                    });
            }
        },
        projects: {
            type: new GraphQLList(ProjectType),
            args: { account_id: {type: GraphQLInt} },
            resolve(parent, args){
                return axios.get(`${urls.projects}/${args.account_id}`)
                    .then(function (response) {
                        return response.data;
                    }).catch(function (error) {
                        console.log(error);
                    });
            }
        },
        asset: {
            type: AssetType,
            args: { account_id: {type: GraphQLInt}, id: { type: GraphQLID } },
            resolve(parent, args){
                return axios.get(`${urls.asset}/${args.account_id}/${args.id}`)
                    .then(function (response) {
                        return response.data;
                    }).catch(function (error) {
                        console.log(error);
                    });
            }
        },
        assets: {
            type: new GraphQLList(AssetType),
            args: { account_id: {type: GraphQLInt} },
            resolve(parent, args){
                return axios.get(`${urls.assets}/${args.account_id}`)
                    .then(function (response) {
                        return response.data;
                    }).catch(function (error) {
                        console.log(error);
                    });
            }
        },
    }
});

/*
const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addAuthor: {
            type: AuthorType,
            args: {
                name: { type: GraphQLString },
                age: { type: GraphQLInt }
            },
            resolve(parent, args){
                let author = new Author({
                    name: args.name,
                    age: args.age
                });
                return author.save();
            }
        },
        addBook: {
            type: BookType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                genre: { type: new GraphQLNonNull(GraphQLString) },
                authorId: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve(parent, args){
                let book = new Book({
                    name: args.name,
                    genre: args.genre,
                    authorId: args.authorId
                });
                return book.save();
            }
        }
    }
});
*/

module.exports = new GraphQLSchema({
    query: RootQuery,
    //mutation: Mutation
});
