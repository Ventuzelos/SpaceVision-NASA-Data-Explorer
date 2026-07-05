import apodImage from "../assets/api-cards/apod.jpg";
import marsImage from "../assets/api-cards/mars.jpg";
import epicImage from "../assets/api-cards/epic.jpg";
import neowsImage from "../assets/api-cards/neows.jpg";

export const nasaApis = [
  {
    title: "APOD",
    description: "Astronomy Picture of the Day",
    image: apodImage,
    link: "/apod",
  },
  {
    title: "Mars Rover",
    description: "Explore photos captured on Mars",
    image: marsImage,
    link: "/mars-rover",
  },
  {
    title: "EPIC",
    description: "Daily imagery of planet Earth",
    image: epicImage,
    link: "/epic",
  },
  {
    title: "NeoWs",
    description: "Near Earth Object Web Service",
    image: neowsImage,
    link: "/neows",
  },
];