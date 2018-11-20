# LiquidRe DApp

Hello and welcome to the development team! This repository controls the LiquidRe DApp. It is built on meteor and connects to the Ethereum blockchain via various Web3 providers.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. 

### Requirements 

[Nodejs](https://nodejs.org/)

[Meteor](https://meteor.com/install)

[Metamask](https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn)

### Installing Requirements

The following setup process has been written assuming an Ubuntu 16.04+ development environment. It may vary slightly with other distributions, and will be significantly different (and unsupported) on Mac/Windows.

#### Node.js
```
sudo apt-get install -y nodejs nodejs-legacy npm
sudo npm install n -g
sudo n stable
sudo npm install npm@latest -g
```

#### Meteor
```
curl https://install.meteor.com/ | sh

```

### Running the Application
As a standard, we create a ~/code folder in our home directory to check out the repository. We will assume you are doing the same, but you are free to check our code out anywhere you like.

##### Switch MetaMask to the Ropsten Test Network

![Ropsten](https://cdn-images-1.medium.com/max/1600/1*hLnYVfWEnSaqyes7YcJA_g.png)

##### Clone the DApp repository onto your local machine
```
mkdir ~/code
cd ~/code
git clone git@github.com:zachdoty/LiquidRE-DApp.git
```

##### Install dependencies
```
cd LiquidRE-DApp/
meteor npm install
```

##### Start the DApp (meteor)
```
cd ~/code/LiquidRE-DApp/
npm start
```

##### Create development accounts/profiles
You will need several accounts for testing different functionalities on the site. In order to do this, you will have to create multiple MetaMask accounts/profiles and the development team will need to assign your roles.
To get started, set up and name 4 accounts in MetaMask:

![MetaMask Account Creation](https://valanter.com/academy/wp-content/uploads/sites/2/2018/02/metamask-create-account.png)

Accounts/Roles to create:
1. Manager
2. Seller
3. Trustee
4. Investor

Once you have created the profiles, it is recommended to rename them according to their role, submit the following form with your account addresses:

[Ropsten Developer Addresses](https://goo.gl/forms/AIgOXWsfUPOQ1Y932)

Be sure to notify your manager via Telegram once you have submitted the form above.

You will need to sign into these different roles before being able to process certain transaction types. Eg: You must have the seller role to list an IREO

##### Profile Uses
**Seller**
The Seller account is primarily used to create IREOs. It can also be used to upload IREO documents/due diligence, and must be used to select a bid from a Trustee.

**Trustee**
Trustee accounts are required in order to place bids on newly listed IREOs. One bid for a management fee will be selected by the Seller.

**Investor**
Investor accounts are used to fund IREOs as well as buy/sell LRETs.

**Manager**
The manager account can be used to issue TPEGs. In order to issue TPEGs:
1. Visit the [Admin Page](http://localhost:3000/admin)
2. Verify "Your Roles" (top left) includes "Manager"
3. Paste the address of the account into the field to the right of "TPEGs"
4. Enter the number to issue in the field to the right and click Issue

##### Wrapping it up
At this point you should have:
- The DApp running and available on your [localhost](http://localhost:3000)
- MetaMask acting as a Web3 provider on the Ropsten network
- Four accounts in Metamask named after their different roles

##### Creating an IREO/LRET
One common, but complicated process is creating an IREO and/or converting it into a LRET, and is required for testing multiple features of the application.

1. Visit IREO Crowdsales page as a Seller, click the + button and submit a transaction
2. Switch to a Trustee account, visit the IREO and place a bid on it
3. Switch back to the Seller account and select the bid
4. Switch to an Investor account and bid on part/all of the IREO (completing it will convert it into an LRET)
- If you need TPEGs in your Investor account, switch to the Administrator account and enter the walletID/Amount to issue some to that account
- Investors can only buy into an IREO that has been started. (check start/end dates)
5. Any investor account can buy or sell LRETs
6. The Trustee account can be used to deposit TPEGs into the LRET

## Contribution

1. Please keep commits and branches separated per-issue, unless issues depend on each other and are combined into one branch.
2. Always pull latest changes from master before creating a new issue branch.
3. Create a branch from master named after each issue to commit your changes into. Eg: For issue 123 use: 
```
git checkout -b issue123
```
4. Use descriptive commit messages, including the issue number in the message, eg:
```
git commit -m "Finished copiling TPS reports #123"
```
5. If you are pushing unfinished code (at the end of the day, etc) describe what you were working on and include -incomplete in your last commit message:
```
git commit -m "Refactoring database -incomplete #123"
```
6. Once an issue is complete, push the branch back up to Github
```
git push --set-upstream origin issue123
```
- Do not push changes directly to master unless specifically requested to
7. Create a Pull Request on Github, referencing the issue number(s) your branch resolves
8. Switch back to master and pull before creating a new branch/working on a new issue (you don't want to branch off a branch that hasn't been reviewed/accepted)
```
git checkout master
git checkout issue456
```

### Development Environment/Resources
While these are not a requirements, we have some standard tools that we like developing with.

##### Editor: Visual Studio Code
[VSCode](https://code.visualstudio.com/)

##### Syntax Highlighting
[Solidity Plugin](https://github.com/juanfranblanco/vscode-solidity)

##### Quick Reference
- All pages exist under imports/ui/ and have a HTML file with corresponding js file
- The HTML file has a template/name section and is imported via the js file
- The js file is used to create helper functions to be used in the HTML template
- The js file needs to be sourced in /imports/startup/client/init.js
- See existing files for examples

Need a quick way to search through the codebase for a specific string?
```
grep -inr "search string" | grep -v ".meteor\|node_modules"
```
(this is a case insensitive, recursive search that includes line numbers, excluding anything in the .meteor or node_modules folders)
[Truffle Documentation](http://truffleframework.com/docs/)
[Eth JS API](https://github.com/ethereum/wiki/wiki/JavaScript-API)

## License

This project is proprietary/closed source. You may access it for development purposes and may not distribute it.
