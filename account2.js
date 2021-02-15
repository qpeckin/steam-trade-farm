const SteamUser = require('steam-user');
const SteamTotp = require('steam-totp');
const SteamCommunity = require('steamcommunity');
const TradeOfferManager = require('steam-tradeoffer-manager');
const chalk = require('chalk');
const chalkAnimation = require('chalk-animation');
const gradient = require('gradient-string');

const client = new SteamUser();
const community = new SteamCommunity();
const manager = new TradeOfferManager({
	steam: client,
	community: community,
	language: 'en'
});

//SexyPrompt
console.log(gradient.pastel('Script Started'))
console.log('');
console.log(gradient.pastel('Made with ♥ by qpeckin'));
console.log(gradient.pastel('https://github.com/qpeckin/steam-trade-farm/'));

//SteamLogin
const logOnOptions = {
	accountName: 'LOGIN',
	password: 'PASSWORD',
	twoFactorCode: SteamTotp.generateAuthCode('SHARED_SECRET_FROM_WINAUTH')
};

client.logOn(logOnOptions);

client.on('loggedOn', () => {
	 const rainbow = chalkAnimation.neon('Logged Into Steam'); // Animation starts
        setTimeout(() => {
        rainbow.stop(); // Animation stops
       }, 1000);
        setTimeout(() => {
        rainbow.start(); // Animation resumes
       }, 2000);

 	console.log('');
});

//TokenAutoAccept
client.on('webSession', (sessionid, cookies) => {
	manager.setCookies(cookies);

	community.setCookies(cookies);
	
	//Identity Secret is being used to "sign" the trade confirmation requests.
	//Used to approve trades, if you want to accept the trades on WinAuth add "//" in front of the line 52
	community.startConfirmationChecker(10000, 'IDENTITYSECRET_FROM_WINAUTH');
	
	setInterval(function() {

        console.log('');
	console.log(chalk.yellow('[-]Returning items...'));
	sendRandomItem();
}, 150 * 1000); // 150 * 1000 ms = 2.5 min [reduce '150' by a lower number, really depend on how many items you're using]
});

manager.on('newOffer', (offer) => {
	if (offer.partner.getSteamID64() === 'Account1_STEAMID64') {	//ID64 Of Account1
		offer.accept((err, status) => {
			if (err) {
				console.log(err);
				process.exit();
			} else {
				console.log(chalk.green(`[+]Accepted trade from farm partner - Status: ${status}.`));
			}
		});
	} /*else {
		offer.decline((err) => {
			if (err) {
				console.log(err);
				process.exit();
			} else {
				console.log('[*]Canceled offer from scammer.');
			}
		});
	}*/
});

/*manager.on('newOffer', (offer) => {
    if (offer.itemsToGive.length === 0) {
        offer.accept((err, status) => {
            if (err) {
                console.log(err);
				process.exit();
            } else {
                console.log(`Donation accepted - Status: ${status}.`);
            }
        });
    } else {
        offer.decline((err) => {
            if (err) {
                console.log(err);
            } else {
                console.log('Trade declined (wanted our items).');
            }
        });
    }
});*/

//SendingTrades
function sendRandomItem() {
	manager.loadInventory(753, 6, true, (err, inventory) => {
		if (err) {
			console.log(err);
			process.exit();
		} else {
			const offer = manager.createOffer('https://steamcommunity.com/tradeoffer/new/?partner=XXXXXXXXX&token=XXXXXXXX');	//TradeLink Of Account1
			//const item = inventory[Math.floor(Math.random() * inventory.length - 1)];
			
			
			let accessAllowed;
			//const quantity = [Math.floor(inventory.length)];
			//console.log(iloscitemowweq);
			
			/*if (quantity > 4) {
			  //const item1 = inventory[Math.floor(inventory.length - 1)];
			  //offer.addMyItem(item1);
			  offer.addMyItem({"appid": 753,"contextid": 6,"assetid": "6229351376","amount": "69"});
			} else {*/
			
			//PassivBot = Transfer whole inventory every x min back to Account1
			
			inventory.forEach(function(element) {
				offer.addMyItem(element);
				//console.log(element);
				//console.log("NEXT:");
});
			/*
			  const item1 = inventory[Math.floor(Math.random() * inventory.length - 1)];
			  offer.addMyItem(item1);*/
			  
			//}
			
			
			//console.log(item);
			//const item2 = inventory[Math.floor(inventory.length - 2)];

			//offer.addMyItem(item);
			//offer.addMyItem(item2);
			//offer.addMyItem({"appid": 753,"contextid": 6,"assetid": "6229351376","amount": "69"}); //Default Items: Steam
			//offer.setMessage(`Wow! You get a ${item1.name}!`);	//Donation Variant
			offer.setMessage(`qpeckin's technologies`);
			offer.send((err, status) => {
				if (err) {
					console.log(err);
					process.exit();
				} else {
					console.log(chalk.yellow(`[-]Sent offer - Status: ${status}.`));
					console.log(chalk.magentaBright('[!]Remember to leave a star in github'));
                                        console.log('');
					//console.log(item1);
				}
			});
		}
	});
}
