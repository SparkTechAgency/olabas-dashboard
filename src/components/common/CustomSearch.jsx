import { useState } from "react";
import { SearchOutlined } from "@ant-design/icons";

const CustomSearch = ({ onSearch }) => {
  const [searchValue, setSearchValue] = useState("");

  const handleSearch = () => {
    if (searchValue.trim() !== "") {
      onSearch(searchValue); // call parent onSearch
      setSearchValue(""); // reset input
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="flex h--8 border border-gray-300  rounded-md overflow-hidden">
      <input
        type="text"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="input search text"
        className="flex-1 h-full px-3 text-xs focus:outline-none focus:ring-1 focus:ring-smart "
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
