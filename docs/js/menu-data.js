
const KARTE = [
  {
    id: "cocktails",
    titel: "Cocktails",
    items: [
      { name: "Espresso Martini", zutaten: "Vodka, Kahlúa, Espresso, Rohrzucker", preis: "11,00" },
      { name: "Pornstar Martini", zutaten: "Vodka, Passoã, Maracuja, Vanille, Limette", preis: "12,00" },
      { name: "Daiquiri Strawberry", zutaten: "Rum, Erdbeerpüree, Limette", preis: "12,00" },
      { name: "Mango Daiquiri", zutaten: "Rum, frische Mangos, Mangosaft, Rohrzucker", preis: "12,00" },
      { name: "Butterfly Mojito", zutaten: "Rum, Butterfly Pea Tea, Pink Grapefruit, Limette, Minze, Rohrzucker", preis: "12,00", aus: true },
      { name: "Amaretto Sour", zutaten: "Amaretto, Zitrone, Schaum, Rohrzucker", preis: "10,00" },
      { name: "Likör 43 Sour", zutaten: "Likör 43, Zitrone, Schaum, Rohrzucker", preis: "10,00" },
      { name: "Whisky Sour", zutaten: "Whisky, Zitrone, Schaum, Rohrzucker", preis: "10,00" },
      { name: "Solero", zutaten: "Vodka, Orange, Maracuja, Vanille, Zitrone", preis: "10,00" },
      { name: "Caipi Berry", zutaten: "Cachaça, Beeren, Rohrzucker, Limette", preis: "11,00", tipp: true },
      { name: "Bumbu Mule", zutaten: "Bumbu Rum, Spicy Ginger Ale, Limette", preis: "11,00" },
      { name: "Moscow Mule", zutaten: "Vodka, Ginger Ale, Limette", preis: "10,00" },
      { name: "White Russian", zutaten: "Vodka, Kahlúa, Sahne", preis: "11,00" },
      { name: "Tropical Grind", zutaten: "Bumbu Rum, Lycheepüree, Mango, Zitrone, Pfeffer", preis: "12,00" },
      { name: "Coconut Pine Reserve", zutaten: "Bumbu Rum, Ananas, Kokosnusspüree", preis: "11,00" },
      { name: "Long Island", zutaten: "Rum, Vodka, Gin, Tequila, Cointreau, Cola, Zitrone", preis: "12,00" },
      { name: "Cuba Libre", zutaten: "Rum, Cola, Limette", preis: "8,50" },
      { name: "Hot Grape", zutaten: "Vodka, Mango, Lychee, Tabasco, Zitrone", preis: "10,00", aus: true },
      { name: "Sex on the Beach", zutaten: "Vodka, Peachtree, Orange, Cranberry, Zitrone", preis: "9,00" },
      { name: "Pearfection", zutaten: "Bumbu Rum, Birnenpüree, Agave, Mango, Limette", preis: "11,00", aus: true },
      { name: "Pimm's Cup", zutaten: "Pimm's No.1, Orange, Ginger Ale, Gurke, Minze, Limette", preis: "9,00" },
      { name: "Last Word", zutaten: "Gin, Chartreuse, Maraschino Liqueur, Limette", preis: "10,00", aus: true },
      { name: "Dark 'n Stormy", zutaten: "Kraken Spiced Rum, Spicy Ginger Ale, Limette", preis: "9,00" },
      { name: "Peach Bellini", zutaten: "Tequila, Triple Sec, Pfirsichpüree, Limette", preis: "11,00" },
      { name: "Penumbra", zutaten: "Gin, Aperol, Maracuja, Eiklar, Zitrone", preis: "9,00", tipp: true },
      { name: "Negroni Classic / Negroni White", zutaten: "Gin, Campari, Vermouth / Italicus, Vermouth, Gin", preis: "10,00" },
      { name: "Gin Basil Smash", zutaten: "Gin, Basilikum, Zitrone, Rohrzucker", preis: "12,00" }
    ]
  },
  {
    id: "longdrinks",
    titel: "Longdrinks",
    items: [
      { name: "Lillet Berry", zutaten: "Lillet, Wildberry, dunkle Beeren", preis: "8,50" },
      { name: "Sekt Energy", zutaten: "Sekt, Energy", preis: "9,00" },
      { name: "Gin Tonic", zutaten: "Gin, Tonic Water", preis: "8,50" },
      { name: "Rum / Vodka / Whisky Cola", zutaten: "Spirituose nach Wahl, Cola", preis: "8,50" },
      { name: "Vodka Orange", zutaten: "Vodka, Orange", preis: "8,50" },
      { name: "Aperol Spritz", zutaten: "Aperol, Prosecco, Soda", preis: "8,50" },
      { name: "Malibu Ananas", zutaten: "Malibu, Ananassaft", preis: "8,50" },
      { name: "Vodka Lemon", zutaten: "Vodka, Limettensaft", preis: "8,50" },
      { name: "Campari Orange", zutaten: "Campari, Orangensaft", preis: "8,50" }
    ]
  },
  {
    id: "shots",
    titel: "Shots",
    hinweis: "4 cl",
    items: [
      { name: "Gisela Homemade", zutaten: "Vodka, frische Limette, Rohrzucker", preis: "4,00" },
      { name: "Special Shot", preis: "4,50", aus: true },
      { name: "Brainfuck", zutaten: "Kaffeelikör, Peachtree, Grenadine", preis: "4,50" },
      { name: "B52", zutaten: "Kahlúa, Baileys, Stroh 80", preis: "5,00" },
      { name: "Vodka oder Tequila", preis: "4,00" },
      { name: "Ramazzotti", preis: "4,00" },
      { name: "Jägermeister", preis: "4,00" },
      { name: "Snickers", zutaten: "Haselnusslikör, Kahlúa, Baileys", preis: "5,00" },
      { name: "Berliner Luft", preis: "4,50" }
    ]
  },
  {
    id: "bier",
    titel: "Bier",
    items: [
      { name: "Carlsberg vom Fass", preis: "4,50" },
      { name: "Carlsberg 0,0%", preis: "4,00" },
      { name: "Corona", preis: "5,00" },
      { name: "Duckstein", preis: "5,50" },
      { name: "Somersby Apfel", preis: "5,00" },
      { name: "Somersby Wassermelone", preis: "5,00" }
    ]
  },
  {
    id: "wein-sekt",
    titel: "Wein & Sekt",
    items: [
      { name: "Rotwein", preis: "6,50" },
      { name: "Weißwein", preis: "6,50" },
      { name: "Roséwein", preis: "6,50" },
      { name: "Sekt", preis: "4,00" },
      { name: "Sekt auf Eis", preis: "5,00" }
    ]
  },
  {
    id: "lemonade",
    titel: "Homemade Lemonades",
    items: [
      { name: "Dark Berry Lemonade", zutaten: "Wildbeer-Zitronen-Limonade", preis: "6,50" },
      { name: "Cucumber Lemonade", zutaten: "Gurke-Basilikum-Limonade", preis: "6,50" },
      { name: "Strawberry Lemonade", zutaten: "Erdbeer-Wildberry-Limonade", preis: "6,50" },
      { name: "Kiwi Lemonade", zutaten: "Kiwi-Zitronen-Limonade", preis: "6,50" }
    ]
  },
  {
    id: "mocktails",
    titel: "Mocktails",
    hinweis: "alkoholfrei",
    items: [
      { name: "Virgin Solero", zutaten: "Orange, Maracuja, Vanille, Zitrone", preis: "8,00" },
      { name: "Ipanema", zutaten: "Maracuja, Ginger Ale, Limette, Rohrzucker", preis: "8,00" },
      { name: "Triple Strawberry Dream", zutaten: "Erdbeerpüree, Erdbeersirup, Erdbeersaft, Minze", preis: "9,00" },
      { name: "Exotic Fruit", zutaten: "Banane, Mango, Ananas, Himbeersirup", preis: "8,00" },
      { name: "Nojito", zutaten: "Limette, Ginger Ale, Minze, Rohrzucker", preis: "8,50" },
      { name: "Virgin Coconut Pine Reserve", zutaten: "Kokosnusspüree, Ananas, Drachenfrucht", preis: "9,50" },
      { name: "Virgin Pearfection", zutaten: "Birnenpüree, Agave, Mango, Limette", preis: "9,00", aus: true },
      { name: "Cucumber Cooler", zutaten: "Gurke, Agave, Soda, Minze, Zitrone", preis: "8,00" },
      { name: "Blueberry Lavender", zutaten: "Blaubeerpüree, Lavendel, Zitrone", preis: "9,00" },
      { name: "Lady Maison", zutaten: "Drachenfrucht, Lycheepüree, Zitrone", preis: "9,00" }
    ]
  },
  {
    id: "softdrinks",
    titel: "Softdrinks",
    items: [
      { name: "Coca Cola", preis: "3,00" },
      { name: "Coca Cola Zero", preis: "3,00" },
      { name: "Sprite", preis: "3,50" },
      { name: "Fuze Tea Peach", preis: "3,50" },
      { name: "Fuze Tea Zitrone", preis: "3,50" },
      { name: "Lichtenauer still", preis: "3,50" },
      { name: "Lichtenauer spritzig", preis: "3,50" },
      { name: "Tonic", preis: "3,50" },
      { name: "Ginger Ale", preis: "3,50" },
      { name: "Wildberry", preis: "3,50" },
      { name: "Apfelschorle", preis: "4,00" },
      { name: "Goldberg", preis: "3,50" },
      { name: "Fever Tree Mediterranean Tonic", preis: "4,80" }
    ]
  },
  {
    id: "energy",
    titel: "Energy",
    items: [
      { name: "Red Bull White", preis: "4,00" },
      { name: "Red Bull Pink", preis: "4,00" },
      { name: "Red Bull Classic", preis: "4,00" },
      { name: "Red Bull Zero", preis: "4,00" },
      { name: "Red Bull Orange", preis: "4,00", aus: true }
    ]
  },
  {
    id: "saefte",
    titel: "Säfte",
    items: [
      { name: "Guavensaft", preis: "4,00", aus: true },
      { name: "Mangosaft", preis: "4,00" },
      { name: "Orangensaft", preis: "4,00" },
      { name: "Ananassaft", preis: "4,00" },
      { name: "Maracujasaft", preis: "4,00" },
      { name: "Erdbeersaft", preis: "4,00" },
      { name: "Cranberrysaft", preis: "4,00" },
      { name: "Apfelsaft", preis: "4,00" },
      { name: "Bananensaft", preis: "4,00" },
      { name: "Lycheesaft", preis: "4,00", aus: true },
      { name: "Tomatensaft", preis: "4,00" },
      { name: "Schw. Johannisbeersaft", preis: "4,00" }
    ]
  },
  {
    id: "flaschen",
    titel: "Flaschen",
    items: [
      { name: "Champagner", preis: "100,00" },
      { name: "Flasche Whisky mit Cola", preis: "90,00" },
      { name: "Flasche Vodka mit 5 Red Bull", preis: "90,00" },
      { name: "Flasche Sekt", preis: "25,00" },
      { name: "Flasche Rot- / Rosé- / Weißwein", preis: "25,00" }
    ]
  }
];
