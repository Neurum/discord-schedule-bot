const { Client, GatewayIntentBits } = require('discord.js');
const { token, guildId } = require('./config.json');

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildScheduledEvents],
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

const date = new Date();
let year = date.getFullYear();
let month = date.getMonth() + 1;
let day = date.getDate() + 1;
let startTime = `${year}-${month}-${day}T23:00:00+0000`;
let endTime = `${year}-${month}-${day + 1}T04:59:59+0000`;

function setPZ() {
  changePZ();

  if (currentPZ === 'city') {
    changeCity();
    setPatrolZone = `Sector ${currentCity}`;
  } else {
    changeCounty();
    setPatrolZone = `Sector ${currentCounty}`;
  }

  client.on('ready', async () => {
    console.log(`${client.user.username} is online!`);

    const guild = await client.guilds.fetch(guildId);
    guild.scheduledEvents
      .create({
        name: setPatrolZone,
        scheduledStartTime: `${startTime}`,
        scheduledEndTime: `${endTime}`,
        privacyLevel: 2,
        entityType: 3,
        entityMetadata: {
          location: setPatrolZone,
        },
      })
      .catch((error) => console.log(error.message));
  });
}

let now = new Date();
let timeRemaining = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 20, 44, 0, 0) - now;
if (timeRemaining <= 0) {
  timeRemaining += 8640000000;
}
// setInterval(setPZ, 30000);
client.login(token);