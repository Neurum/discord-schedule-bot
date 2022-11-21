const { Client, Guild, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildScheduledEvents],
});

client.once('ready', () => {
  console.log(`${client.user.username} is online!`);
});

const patrolZone = ['city', 'county1', 'county2'];
let currentPZ = patrolZone[0];

const countyZones = ['2', '3', '11', '4'];
const cityZones = ['5', '9', '10', '8', '6', '7'];

let currentCounty = null;
let currentCity = null;

let setPatrolZone = null;

const changePZ = () => {
  const removed = patrolZone.shift();
  patrolZone.push(removed);
  currentPZ = patrolZone[0];
};

const changeCounty = () => {
  const removed = countyZones.shift();
  countyZones.push(removed);
  currentCounty = countyZones[0];
};

const changeCity = () => {
  const removed = cityZones.shift();
  cityZones.push(removed);
  currentCity = cityZones[0];
};
let setPZ = () => {
  changePZ();

  if (currentPZ === 'city') {
    changeCity();
    setPatrolZone = `Sector ${currentCity}`;
  } else {
    changeCounty();
    setPatrolZone = `Sector ${currentCounty}`;
  }

  const date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  let usedDate = `${year}-${month}-${day}`;

  client.guilds.scheduledEvents
    .create({
      name: setPatrolZone,
      scheduledStartTime: `${usedDate}T18:00:00+0000`,
      scheduledEndTime: `${usedDate}T23:59:59+0000`,
      privacyLevel: 2,
      entityType: 'EXTERNAL',
      entityMetadata: {
        location: setPatrolZone,
      },
    })
    .catch((error) => console.log(error.message));
};
let now = new Date();
let timeRemaining = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 16, 08, 45, 0) - now;
if (timeRemaining <= 0) {
  timeRemaining += 86400000;
}
setTimeout(() => {
  setPZ();
}, timeRemaining);

client.login(token);
