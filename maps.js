"use strict";
const emojis = {
  "-": " ",
  O: "🚪",
  X: "#",
  I: "🏠",
  PLAYER: "🚘",
  BOMB_COLLISION: "💥",
  GAME_OVER: "👎",
  WIN: "🏆",
  HEART: "❤️",
};

const maps = [];
maps.push(`
  IXXXXXXXXX
  -XXXXXXXXX
  -XXXXXXXXX
  -XXXXXXXXX
  -XXXXXXXXX
  -XXXXXXXXX
  -XXXXXXXXX
  -XXXXXXXXX
  -XXXXXXXXX
  OXXXXXXXXX
`);
maps.push(`
  O--XXXXXXX
  X--XXXXXXX
  XX----XXXX
  X--XX-XXXX
  X-XXX--XXX
  X-XXXX-XXX
  XX--XX--XX
  XX--XXX-XX
  XXXX---IXX
  XXXXXXXXXX
  `);
maps.push(`
  I-----XXXX
  XXXXX-XXXX
  XX----XXXX
  XX-XXXXXXX
  XX-----XXX
  XXXXXX-XXX
  XX-----XXX
  XX-XXXXXXX
  XX-----OXX
  XXXXXXXXXX
`);
maps.push(`
  I-----XXXX
  XXXXX-XXXX
  XX--------
  XXXXXXXXX-
  XX--------
  XXXXXX-XXX
  XX-----XXX
  XX-XXXXXXX
  XX------XX
  XXXXXXXOXX
`);
maps.push(`
  ---------I
  --XXXXXXXX
  X---------
  XX-XXXXXX-
  XX---X----
  XX-XXX-XXX
  XXX----XXX
  XX--XXXXXX
  XX------XX
  XXXXXXX--O
`);
maps.push(`
  X-----XXXX
  --XXX-XXXX
  IX--------
  XXXXX-XXX-
  ------X---
  -XXXXX-XXX
  -------XXX
  -X-XXXXXXX
  O-------XX
  XXXXXXXXXX
`);
maps.push(`
X-----XXXX
--XXX-XXXI
XX--------
XXXXX-XXX-
------X---
-XXXXX-XXX
-------XXX
-X-XXXXXXX
O-------XX
XXXXXXXXXX
`);
