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

const urls = {
    accounts: 'http://localhost:8001/accounts',
    users: 'http://localhost:8001/users',
    projects: 'http://localhost:8001/projects',
    assets: 'http://localhost:8001/assets',
};

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
                // go to web service to get details
                // use parent.id for account id
                return null;
            }
        }
    })
});

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: GraphQLInt },
        accountId: { type: GraphQLInt },
        added: { type: GraphQLString },
        modified: { type: GraphQLString },
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
        projects: {
            type: new GraphQLList(ProjectType),
            resolve(parent, args){
                // go to web service to get details
                // use parent.id for user id or
                // parent.accountId for account id
                return null;
            }
        }
    })
});

const ProjectType = new GraphQLObjectType({
    name: 'Project',
    fields: () => ({
        id: { type: GraphQLID },
        accountId: { type: GraphQLInt },
        userId: { type: GraphQLInt },
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
        accountId: { type: GraphQLInt },
        userId: { type: GraphQLInt },
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
            args: {
                id: { type: GraphQLInt }
            },
            resolve(parent, args) {
                return axios.get(`${urls.accounts}/${args.id}`)
                    .then(function (response) {
                        return response.data;
                    }).catch(function (error) {
                        console.log(error);
                    });
            }
        },
        author: {
            type: AuthorType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args){
                return Author.findById(args.id);
            }
        },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args){
                return Book.find({});
            }
        },
        authors: {
            type: new GraphQLList(AuthorType),
            resolve(parent, args){
                return Author.find({});
            }
        }
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
