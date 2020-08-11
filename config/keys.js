dbConnection = `mongodb+srv://pedroroweder:${encodeURIComponent('pedroroweder')}@cluster-1.nyegk.gcp.mongodb.net/nodejs-login?retryWrites=true&w=majority`;

module.exports = {
    mongoConnection: dbConnection
}