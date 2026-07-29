import {
  RocketIcon,
  MeteorIcon,
  SunIcon,
  WorldIcon,
} from "../components/home/ApiSection/ApiIcons/customIcons";

import earthImage from "../assets/hero.webp";

const discoverImage =
  "https://images.unsplash.com/photo-1454789548928-9efd52dc4031?crop=entropy&cs=srgb&fm=jpg&q=85&w=800";

const asteroidImage =
  "https://images.unsplash.com/photo-1710268470228-6d77e6d999b3?crop=entropy&cs=srgb&fm=jpg&q=85&w=800";

const sunImage =
  "https://images.unsplash.com/photo-1614642264762-d0a3b8bf3700?crop=entropy&cs=srgb&fm=jpg&q=85&w=800";

export const nasaApis = [
  {
    titleKey: "nasaApis.discover.title",
    descriptionKey: "nasaApis.discover.description",
    categoryKey: "nasaApis.discover.category",
    icon: RocketIcon,
    image: discoverImage,
    imagePosition: "center 40%",
    link: "/discover",
    isLiveApi: false,
  },
  {
    titleKey: "nasaApis.asteroids.title",
    descriptionKey: "nasaApis.asteroids.description",
    categoryKey: "nasaApis.asteroids.category",
    icon: MeteorIcon,
    image: asteroidImage,
    link: "/neowatch",
    isLiveApi: true,
  },
  {
    titleKey: "nasaApis.spaceWeather.title",
    descriptionKey: "nasaApis.spaceWeather.description",
    categoryKey: "nasaApis.spaceWeather.category",
    icon: SunIcon,
    image: sunImage,
    link: "/donki",
    isLiveApi: true,
  },
  {
    titleKey: "nasaApis.earth.title",
    descriptionKey: "nasaApis.earth.description",
    categoryKey: "nasaApis.earth.category",
    icon: WorldIcon,
    image: earthImage,
    link: "/epic",
    isLiveApi: true,
  },
];