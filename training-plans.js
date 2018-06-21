const types = ['natation', 'vélo', 'course à pied', 'none', 'all']

const training8Week = [
  // First week
  {
    type: types[0],
    length: 1500,
    duration: 45,
    description: '2 x 250 m récupération 30 s: 100 m crawl / 25 m dos / 100 m crawl / 25 m brasse.\n10 x 100 m récupération 20 s en alternant un 100 m pull buoy et 100 m nage complète (sans pull buoy).'
  },
  {
    type: types[3]
  },
  {
    type: types[2],
    duration: 60,
    description: '15mn échauffement progressif.\n2 x 15mn allure semi marathon, récupération 5mn entre les séries.\nRetour au calme 10mn.'
  },
  {
    type: types[1],
    duration: 120,
    description: 'Echauffement 20mn.\nCorps de séance : 6 blocs de 10mn sur un grand développement et à une cadence de pédalage de l’ordre de 40 à 50 tpm, sans chercher à rouler vite.\nRécupération 5mn en vélocité entre les blocs.\nRetour au calme 10mn.',
  },
  {
    type: types[3]
  },
  {
    type: types[0],
    length: 2000,
    duration: 45,
    description: '4 x 500 m : le premier avec pull buoy ; le second en 75 m crawl / 25m dos ; le troisième avec pull buoy ; le quatrième en 75 m crawl / 25 m brasse.'
  },
  {
    type: types[1],
    duration: 120,
    description: '2h dont 20mn allure Half Iron Man au centre de chaque heure.'
  },
  // Second week
  {
    type: types[0],
    length: 1700,
    duration: 45,
    description: '4 x 200 m avec pull buoy récupération 30 s.\4 x 100 m avec plaquettes récupération 20 s.\n4 x 50 m nage complète souple récupération 15 s.\n4 x 25 m nage complète rapide récupération 30 s.\n200 m souple en 50 m dos / 50 m crawl.'
  },
  {
    type: types[3]
  },
  {
    type: types[2],
    duration: 60,
    description: '20mn échauffement progressif.\n2 x 10mn en accélération progressive.\nPar tranche de 2mn : 1km/h supplémentaire en débutant allure marathon pour terminer à VMA.\nRécupération 5mn entre les séquences. Retour au calme 15mn.'
  },
  {
    type: types[1],
    duration: 120,
    description: '2h sur un parcours vallonné en passant toutes les côtes en alternant position assis et en danseuse, en force, à une cadence de pédalage de l’ordre de 40 à 50 tpm, sans faire monter les pulsations, sans tirer sur le cintre, sans se déhancher.\nCadence de pédalage de 90 à 95tpm sur le plat.'
  },
  {
    type: types[3]
  },
  {
    type: types[0],
    length: 2300,
    duration: 60,
    description: '(100 m + 200 m + 300 m + 400 m) avec pull buoy.\n(100 m + 200 m + 300 m + 400 m) en nage complète.\nRécupération de 15 s entre les séquences.\nRécupération de 1mn entre les deux séries.\n300 m souple en 50 m dos / 50 m crawl.'
  },
  {
    type: types[1],
    duration: 150,
    description: 'Sortie longue 2h30, quelques accélérations au gré du dénivelé ou sortie en groupe.'
  },
  // Third week
  // {
  //   type: types[0],
  //   duration: 45,
  //   description: 
  // },
  // {
  //   type: types[1],
  //   duration: 60,
  //   description:
  // },
  // {
  //   type: types[2],
  //   duration: 60,
  //   description:
  // },
  // {
  //   type: types[3]
  // },
  // {
  //   type: types[0],
  //   duration: 60,
  //   description:
  // },
  // {
  //   type: types[1],
  //   duration: 60,
  //   description:
  // },
  // {
  //   type: types[4],
  //   duration: 60,
  //   description:
  // },
]

module.exports = training8Week