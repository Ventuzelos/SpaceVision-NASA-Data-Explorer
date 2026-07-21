import { useEffect } from "react";

function PageMeta({ title, description }) {
  useEffect(() => {
    document.title = title;

    const descriptionMeta = document.querySelector(
      'meta[name="description"]'
    );

    if (descriptionMeta && description) {
      descriptionMeta.setAttribute("content", description);
    }
  }, [title, description]);

  return null;
}

export default PageMeta;