
let methods = {
    Admin: 'getAdministrators',
    Manager: 'getManagers',
    Verifier: 'getVerifiers',
    Investor: 'getInvestors',
    Seller: 'getSellers',
    Trustee: 'getTrustees'
}

let getUserAddresses =  Meteor.bindEnvironment((role) => {
    let users = Meteor.users.find({
        'roles': role
    }, {
        username: 1
    }).fetch();
    return users.map(user => {
        return user.username
    });
});

let getUserIDs =  Meteor.bindEnvironment((addresses) => {
    let users = Meteor.users.find({
        'username': {$in: addresses}
    }, {
        _id: 1
    }).fetch();
    return users.map(user => {
        return user._id
    });
});

let updateRole = Meteor.bindEnvironment((_role) => {
    let users = getUserAddresses(_role);
    let method = methods[_role];
    cbWrap(liquidRE.methods[method]().call, Meteor.bindEnvironment(res => {
        let toRemove = users
            .filter(x => !res.includes(x))
        let toAdd = res
            .filter(x => !users.includes(x))
        
        // console.log('users', users)
        // console.log('res', res)
        // console.log('toRemove', _role, method, toRemove);
        // console.log('toAdd', _role, method, toAdd);
        // console.log('*****************');
        
        if(toRemove.length > 0) {
            Roles.removeUsersFromRoles(getUserIDs(toRemove), _role);
        }
        if(toAdd.length > 0) {
            Roles.addUsersToRoles(getUserIDs(toAdd), _role);
        }
    }));
});

let runRoleUpdates = () => {
    setInterval(()=> {
        let roles = Object.keys(methods);
        for(role of roles) {
            updateRole(role);
        }
    }, 15000);
}

export { runRoleUpdates };
