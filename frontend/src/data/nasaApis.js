import apodImage from "../assets/api-cards/apod.jpg";
import donkiImage from "../assets/api-cards/donki.jpg";
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
    title: "DONKI",
    description: "Data Overview for the Last 24 Hours",
    image: donkiImage,
    link: "/donki",
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