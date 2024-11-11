import React from 'react';

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between bg-zinc-50 py-2 shadow-dark-mild dark:bg-neutral-700">
      <div className="flex w-full items-center justify-between px-3">
        {/* App logo on the left */}
        <a className="flex items-center text-neutral-900 dark:text-neutral-200" href="#">
          <img
            src="https://tecdn.b-cdn.net/img/logo/te-transparent-noshadows.webp"
            style={{ height: '30px' }} // Adjust logo size as needed
            alt="App Logo"
            loading="lazy"
          />
        </a>

        {/* Right side: Hamburger button and Shopping Cart */}
        <div className="flex items-center space-x-4">
          {/* Shopping Cart Icon */}
          <a className="text-neutral-600 dark:text-white" href="#">
            <span className="[&>svg]:w-6">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M7.75 4.5a.75.75 0 01.75-.75h8.5a.75.75 0 010 1.5h-8.5a.75.75 0 01-.75-.75zM3 2.25A.75.75 0 003.75 2h16.5a.75.75 0 010 1.5H3.75A.75.75 0 003 2.25zM5.75 7.5a.75.75 0 00-.75.75v8.25c0 .413.336.75.75.75h12.5a.75.75 0 00.75-.75V8.25a.75.75 0 00-.75-.75H5.75zM4.5 16.5h15a.75.75 0 00-.75-.75H5.25a.75.75 0 00-.75.75z"
                />
              </svg>
            </span>
          </a>

          {/* Hamburger button always visible */}
          <button
            className="block border-0 bg-transparent px-2 text-black/50 hover:no-underline focus:outline-none focus:ring-0 dark:text-neutral-200"
            type="button"
            aria-controls="navbarMenu"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="[&>svg]:w-7 [&>svg]:stroke-black/50 dark:[&>svg]:stroke-neutral-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z"
                  clipRule="evenodd" />
              </svg>
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
