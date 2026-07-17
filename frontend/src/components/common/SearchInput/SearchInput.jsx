import Icon from "../Icon/Icon";

import "./SearchInput.css";

function SearchInput({
  placeholder = "Pesquisar imagens, missões ou planetas...",
  value,
  onChange,
  onSubmit,
}) {
  const handleSubmit = (e) => {
    e.preventDefault();

    if (onSubmit) {
      onSubmit(value);
    }
  };

  return (
    <form className="search-input mb-4" onSubmit={handleSubmit}>
      <input
        className="search-input__field"
        type="text"
        placeholder={placeholder}
        aria-label={placeholder}
        value={value}
        onChange={onChange}
      />

      <button
        type="submit"
        className="search-input__button"
        aria-label="Pesquisar"
      >
        <Icon name="Search" size={18} />
      </button>
    </form>
  );
}

export default SearchInput;