import { Icons } from "../constants/icons";

import earthImage from "../assets/hero.webp";

const discoverImage =
  "https://images.unsplash.com/photo-1454789548928-9efd52dc4031?crop=entropy&cs=srgb&fm=jpg&q=85&w=800";
const asteroidImage =
  "https://images.unsplash.com/photo-1710268470228-6d77e6d999b3?crop=entropy&cs=srgb&fm=jpg&q=85&w=800";
const sunImage =
  "https://images.unsplash.com/photo-1614642264762-d0a3b8bf3700?crop=entropy&cs=srgb&fm=jpg&q=85&w=800";

export const nasaApis = [
  {
    title: "Descobrir o Espaço",
    description:
      "Curiosidades, missões icónicas e experiências interativas sobre o Universo.",
    category: "SPACEVISION · DESCOBRIR",
    icon: Icons.Telescope,
    image: discoverImage,
    imagePosition: "center 40%",
    link: "/discover",
  },
  {
    title: "Asteroides",
    description:
      "Rastreio em tempo real de objetos próximos da Terra, com distâncias e velocidades.",
    category: "NASA · NeoWs",
    icon: Icons.Radar,
    image: asteroidImage,
    link: "/neowatch",
  },
  {
    title: "Meteorologia Espacial",
    description:
      "Notificações de tempestades solares, erupções e eventos meteorológicos espaciais.",
    category: "NASA · DONKI",
    icon: Icons.Sun,
    image: sunImage,
    link: "/donki",
  },
  {
    title: "Terra",
    description:
      "Imagens diárias da Terra captadas pela câmara EPIC a bordo do satélite DSCOVR.",
    category: "NASA · EPIC",
    icon: Icons.Globe,
    image: earthImage,
    link: "/epic",
  },
];
