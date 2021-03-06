const faker = require('faker');
const MongoDB = require('../../config/mongo');

(async () => {
  await MongoDB.connect();
  try {
    const tournamentsCollection = MongoDB.db.collection('Tournaments');
    const participantsCollection = MongoDB.db.collection('Participants');

    const countTournaments = await tournamentsCollection.countDocuments();
    if (countTournaments) {
      await tournamentsCollection.drop();
    }

    const countParticipants = await participantsCollection.countDocuments();
    if (countParticipants) {
      await participantsCollection.drop();
    }

    const participants = [];
    for (let i = 0; i < 50; i++) {
      const participant = {
        name: faker.name.findName(),
        username: faker.internet.userName(),
        email: faker.internet.email(),
        phone: faker.phone.phoneNumber(),
      };
      participants.push(participant);
    }
    await participantsCollection.insertMany(participants);

    const tournaments = [];
    for (let i = 0, p = 0; i < 5; i += 1, p += 10) {
      const tournament = {
        name: faker.lorem.words(3),
        participantsid: participants
          .slice(p, p + 10)
          .map((participant) => participant._id),
        description: faker.commerce.productDescription(),
        location: faker.address.streetAddress(),
        prices: [
          faker.commerce.price(),
          faker.commerce.price(),
          faker.commerce.price(),
        ],
        country: faker.address.country,
        status: Math.random() < 0.5,
        format: 0,
        organizador: {
          name: faker.name.findName(),
        },
      };
      tournaments.push(tournament);
    }
    await tournamentsCollection.insertMany(tournaments);

    console.log('Database seeder');
  } catch (err) {
    console.error(err);
  } finally {
    MongoDB.connection.close();
  }
})();
