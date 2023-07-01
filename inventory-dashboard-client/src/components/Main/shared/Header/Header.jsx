import React from "react";

const Header = () => {
  return (
    <div className="z-10 relative">
      <div className="navbar bg-base-100 shadow-lg px-5">
        <div className="flex-1">
          <a className="btn btn-ghost normal-case text-xl">
            <img
              className="w-full h-10 object-cover"
              src="https://i.ibb.co/TW8T2kc/logo-momley.png"
              alt=""
            />
          </a>
        </div>
        <div className="flex-none gap-2">
          <div className="form-control">
            <input
              type="text"
              placeholder="Search"
              className="input input-bordered w-60 md:w-96 rounded-full"
            />
          </div>
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img src="https://i.ibb.co/LpsnbCC/Rectangle-182.png" />
              </div>
            </label>
            <ul
              tabIndex={0}
              className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
            >
              <li>
                <a className="justify-between">
                  Profile
                  <span className="badge">New</span>
                </a>
              </li>
              <li>
                <a>Settings</a>
              </li>
              <li>
                <a>Logout</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
