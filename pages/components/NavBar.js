import axios from "axios";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";

const apiPath = path => `http://localhost:3000${path}`;

function useSearch() {
    const [value, setValue] = useState("");
    const [results, setResults] = useState([]);
    const [debouncedCallback] = useDebouncedCallback(value => {
        const searchUrl = apiPath(`/s/?q=${value}`);
        axios.get("/s/?q=" + value).then(res => {
            setResults(res.data.map(e => e.ref));
        });
    }, 300);
    function onChange(value) {
        setValue(value);
        debouncedCallback(value);
    }
    return [value, results, onChange];
}

function SearchBar() {
    const [query, results, setQuery] = useSearch();
    return (
        <div className="w-100 dropdown">
            <input
                className="form-control form-control-dark w-100"
                type="text"
                placeholder="Search"
                aria-label="Search"
                value={query}
                onChange={e => setQuery(e.target.value)}
            />
            {results.length > 0 && (
                <div className="dropdown-results w-100">
                    {results.map(e => (
                        <a href={encodeURIComponent(e)}>{e}</a>
                    ))}
                </div>
            )}
        </div>
    );
}

export function NavBar() {
    return (
        <nav className="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0">
            <a className="navbar-brand col-sm-3 col-md-2 mr-0" href="#">
                Cicada
            </a>
            <SearchBar />
            <ul className="navbar-nav px-3">
                <li className="nav-item text-nowrap">
                    <a className="nav-link" href="#">
                        Sign out
                    </a>
                </li>
            </ul>
        </nav>
    );
}
