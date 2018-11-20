// ClientIREOs = new Mongo.Collection('client-ireos', { connection: null });
// ClientLRETs = new Mongo.Collection('client-lrets', { connection: null });
ClientTrustees = new Mongo.Collection('client-trustees', { connection: null });
ClientProperties = new Mongo.Collection('client-properties', { connection: null });
ClientStableToken = new Mongo.Collection('client-stabletoken', { connection: null });
ClientSellers = new Mongo.Collection('client-sellers', { connection: null });
ClientInvestors = new Mongo.Collection('client-investors', { connection: null });
ClientAdministrators = new Mongo.Collection('client-administrators', { connection: null });
ClientManagers = new Mongo.Collection('client-managers', { connection: null });
ClientVerifiers = new Mongo.Collection('client-verifiers', { connection: null });
ClientRENT = new Mongo.Collection('client-rent', { connection: null });
// ClientWeb3Filters = new Mongo.Collection('client-web3filters', { connection: null }); // TODO: use this to track web3 filters being watched and have a function that unwatches them if you're no longer on a page where the filter is useful. a pages oncreated will re-add relevant watches if they're not currently watched. and a timer helper function will remove them if they're no longer relevant based on the route
// new PersistentMinimongo2(ClientTrustees, 'LiquidRE-ClientTrustees');
// new PersistentMinimongo2(ClientProperties, 'LiquidRE-ClientProperties');
// new PersistentMinimongo2(ClientStableToken, 'LiquidRE-ClientStableToken');
// new PersistentMinimongo2(ClientSellers, 'LiquidRE-ClientSellers');
// new PersistentMinimongo2(ClientWeb3Filters, 'LiquidRE-ClientWeb3Filters');

