const SteamUser = require('steam-user');
const SteamTotp = require('steam-totp');
const SteamCommunity = require('steamcommunity');
const TradeOfferManager = require('steam-tradeoffer-manager');

const client = new SteamUser();
const community = new SteamCommunity();
const manager = new TradeOfferManager({
	steam: client,
	community: community,
	language: 'en'
});
//SteamLogin
const logOnOptions = {
	accountName: 'STEAMLOGIN',
	password: 'PASSWORD',
	twoFactorCode: SteamTotp.generateAuthCode('SHARED_SECRET_FROM_WINAUTH')
};

client.logOn(logOnOptions);

client.on('loggedOn', () => {
	console.log('Logged Into Steam');
});

//TokenAutoAccept
client.on('webSession', (sessionid, cookies) => {
	manager.setCookies(cookies);

	community.setCookies(cookies);
	
	//Identity Secret is being used to "sign" the trade confirmation requests.
	//Used to approve trades, if you want to accept the trades on WinAuth add "//" in front of the line 34
	community.startConfirmationChecker(10000, 'IDENTITYSECRET_FROM_WINAUTH');
	
	setInterval(function() {

	console.log('[-]Returning items...');
	sendRandomItem();
}, 240 * 1000); // 240 * 1000 ms = 4 min [reduce '240' by a lower number, really depend on how many items you're using]
});

manager.on('newOffer', (offer) => {
	if (offer.partner.getSteamID64() === 'STEAMID64_OF_ACCOUNT1') {	//ID64 Of Account1
		offer.accept((err, status) => {
			if (err) {
				console.log(err);
				process.exit();
			} else {
				console.log(`[+]Accepted trade from farm partner - Status: ${status}.`);
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
			//console.log(number of items);
			
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
					console.log(`[-]Sent offer - Status: ${status}.`);
					console.log('[!]Remember to leave a star in github');
					//console.log(item1);
				}
			});
		}
	});
}

