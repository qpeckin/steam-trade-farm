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
	community.startConfirmationChecker(4000, 'IDENTITYSECRET_FROM_WINAUTH'); // 
	
	//var randomtimer = (Math.floor(Math.random() * (17 - 11)) + 11);	
	setInterval(function() {

	console.log('[-]Trying to send trade...');
	sendRandomItem();
}, 5500); // random * 1000 milsec //}, randomtimer * 1000);
});

manager.on('newOffer', (offer) => {
	if (offer.partner.getSteamID64() === 'STEAMID64_OF_ACCOUNT2') {	//ID64 Of Account2
		offer.accept((err, status) => {
			if (err) {
				qpeckin_catch_steam_errors(err);
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
                console.log(`Trade accepted - Status: ${status}.`);
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
			qpeckin_catch_steam_errors(err);
		} else {
			const offer = manager.createOffer('https://steamcommunity.com/tradeoffer/new/?partner=XXXXXXXXX&token=XXXXXXXX');	//TradeLink Of Account2
			//const item = inventory[Math.floor(Math.random() * inventory.length - 1)];
			
			
			let accessAllowed;
			//const quantity = [Math.floor(inventory.length)];
			//console.log(quantity);
			
			/*if (quantity > 4) {
			  //const item1 = inventory[Math.floor(inventory.length - 1)];
			  //offer.addMyItem(item1);
			  offer.addMyItem({"appid": 753,"contextid": 6,"assetid": "6229351376","amount": "69"});
			} else {*/
			  const item1 = inventory[Math.floor(Math.random() * inventory.length - 1)];
			  offer.addMyItem(item1);
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
					qpeckin_catch_steam_errors(err);
				} else {
					console.log(`[-]Sent offer - Status: ${status}.`);
					//console.log(item1);
				}
			});
		}
	});
}


function qpeckin_catch_steam_errors(log) {
	
	console.log(log);
	console.log("Testing if we know this error...");

	var x = log.toString();
	
	
	//Check if we know the errors
	if (x.includes('There was an error ') || x.includes('d during')) {
		console.log("Yes - ignoring...");	/*catches both incoming and sent offers!*/
	}
	else if (x.includes("Cannot read property 'appid' of undefined")) {
		console.log("Yes - ignoring...");
	}
	else if (x.includes("too many") || x.includes("too much")) {
		console.log("Yes - ignoring...");
	}
	else {
		console.log("Unknown error - restarting...");
		process.exit();
	}
	
}

