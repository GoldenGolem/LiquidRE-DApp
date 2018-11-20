const ethUtil = require('ethereumjs-util');


// from accounts-password code
var createUser = function (options) {
  // Unknown keys allowed, because a onCreateUserHook can take arbitrary
  // options.
  check(options, Match.ObjectIncluding({
    username: Match.Optional(String),
    email: Match.Optional(String),
  }));

  var username = options.username;
  var email = options.email;
  if (!username && !email)
    throw new Meteor.Error(400, "Need to set a username or email");

  var user = {services: {}};
  if (options.password) {
    var hashed = hashPassword(options.password);
    user.services.password = { bcrypt: hashed };
  }

  if (username)
    user.username = username;
  if (email)
    user.emails = [{address: email, verified: false}];

  return Accounts.insertUserDoc(options, user);
};

Accounts.registerLoginHandler('ETHLogin', function (options) {
    var _signature_response_hex = options.signature; 
    var _challenge_digest_hash = options.msgHash;
    var _from = options.from;

    if (typeof _challenge_digest_hash != 'buffer') {
      _challenge_digest_hash = Buffer.from(_challenge_digest_hash, 'hex')
    }

    var vrs_data = ethUtil.fromRpcSig(_signature_response_hex)
  
    var public_key_from_sig = ethUtil.ecrecover(_challenge_digest_hash, vrs_data.v, vrs_data.r, vrs_data.s)
    var public_key_from_sig_hex = public_key_from_sig.toString('hex')
  
    var address_at_pub_key = ethUtil.publicToAddress(public_key_from_sig);
    var public_address_from_sig_hex = address_at_pub_key.toString('hex');
  
    var userAddress = (`0x${public_address_from_sig_hex}`);
    if(userAddress.toLowerCase() == _from.toLowerCase()) {
      userAddress = _from;
    }
    user = Meteor.users.findOne({ 'username': userAddress });   
    var uid;
    if(user)
      uid = user._id; 
    else {
      uid = createUser({ username: userAddress });
      Roles.addUsersToRoles(uid, 'Member');
    }
    return { userId: uid };
  });
