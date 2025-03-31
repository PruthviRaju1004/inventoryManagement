import { useState } from "react";
import { Search } from "lucide-react";

interface SearchBarProps {
    onSearch: (query: string) => void;
    placeholder?: string;
}

const SearchBar = ({ onSearch, placeholder = "Search..." }: SearchBarProps) => {
    const [query, setQuery] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);
        onSearch(value);
    };

    return (
        <div className="relative w-[300px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
            <input
                type="text"
                value={query}
                onChange={handleChange}
                placeholder={placeholder}
                className="px-9 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary w-[400px] h-12"
            />
        </div>
    );
};

export default SearchBar;
