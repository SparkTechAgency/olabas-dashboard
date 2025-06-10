import { useState } from "react";
import { SearchOutlined } from "@ant-design/icons";

const CustomSearch = ({ onSearch, placeholder }) => {
  const [searchValue, setSearchValue] = useState("");

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    onSearch(value); // Call parent onSearch immediately on input change
  };

  const handleSearch = () => {
    onSearch(searchValue); // Call parent onSearch with current value
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="flex h-8 border border-gray-300 rounded-md overflow-hidden">
      <input
        type="text"
        value={searchValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="flex-1 h-full px-3 text-xs focus:outline-none focus:ring-1 focus:ring-smart"
      />
      <button
        onClick={handleSearch}
        className="h-full bg-smart text-white hover:bg-smart/80 flex items-center justify-center px-4"
      >
        <SearchOutlined />
      </button>
    </div>
  );
};

export default CustomSearch;
