import { useEffect, useState } from "react"
import { AiOutlineMenu, AiOutlineShoppingCart, AiOutlineClose } from "react-icons/ai"
import { BsChevronDown } from "react-icons/bs"
import { useSelector } from "react-redux"
import { Link, matchPath, useLocation } from "react-router-dom"

import logo from "../../assets/Logo/Logo-Full-Light.png"
import { NavbarLinks } from "../../data/navbar-links"
import { apiConnector } from "../../services/apiConnector"
import { categories } from "../../services/apis"
import { ACCOUNT_TYPE } from "../../utils/constants"
import ProfileDropdown from "../core/Auth/ProfileDropdown"



function Navbar() {
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)
  const { totalItems } = useSelector((state) => state.cart)
  const location = useLocation()

  const [subLinks, setSubLinks] = useState([])
  const [loading, setLoading] = useState(false)
  const [isOpen, setToggle] = useState(false)
  useEffect(() => {
    (async () => {
      setLoading(true)
      try {
        const res = await apiConnector("GET", categories.CATEGORIES_API)
        setSubLinks(res.data.data)
       console.log(res.data.data)
      } catch (error) {
        console.log("Could not fetch Categories.", error)
      }
      setLoading(false)
    })()
  }, [])

 function Toggle() {
    setToggle(isOpen? false:true)
 }
  // console.log("sub links", subLinks)

  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname)
  }

  return (
    <div className="">
      <div className="border-2">
        <div
        className={` hidden md:flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700 ${
          location.pathname !== "/" ? "bg-richblack-800" : ""
        } transition-all duration-200`}
        >
          <div className="flex w-11/12 max-w-maxContent items-center justify-between">
            {/* Logo */}
            <Link to="/">
              <img src={logo} alt="Logo" width={160} height={32} loading="lazy" />
            </Link>
            {/* Navigation links */}
            <nav className="hidden md:block">
              <ul className="flex gap-x-6 text-richblack-25">
                {NavbarLinks.map((link, index) => (
                  <li key={index}>
                    {link.title === "Catalog" ? (
                      <>
                        <div
                          className={`group relative flex cursor-pointer items-center gap-1 ${
                            matchRoute("/catalog/:catalogName")
                              ? "text-yellow-25"
                              : "text-richblack-25"
                          }`}
                        >
                          <p>{link.title}</p>
                          <BsChevronDown />
                          <div className="invisible absolute left-[50%] top-[50%] z-[1000] flex w-[200px] translate-x-[-50%] translate-y-[3em] flex-col rounded-lg bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[300px]">
                            <div className="absolute left-[50%] top-0 -z-10 h-6 w-6 translate-x-[80%] translate-y-[-40%] rotate-45 select-none rounded bg-richblack-5"></div>
                            {loading ? (
                              <p className="text-center">Loading...</p>
                            ) : subLinks? (
                              <>
                                {subLinks
                                  ?.filter(
                                    (subLink) => subLink?.courses?.length >= 0
                                  )
                                  ?.map((subLink, i) => (
                                    <Link
                                      to={`/catalog/${subLink.name
                                        .split(" ")
                                        .join("-")
                                        .toLowerCase()}`}
                                      className="rounded-lg bg-transparent py-4 pl-4 hover:bg-richblack-50"
                                      key={i}
                                    >
                                    
                                    
                                      <p className="text-center">{subLink.name}</p>
                                    </Link>
                                  ))}
                              </>
                            ) : (
                              <p className="text-center">No Courses Found</p>
                            )}
                          </div>
                        </div>
                      </>
                    ) : (
                      <Link to={link?.path}>
                        <p
                          className={`${
                            matchRoute(link?.path)
                              ? "text-yellow-25"
                              : "text-richblack-25"
                          }`}
                        >
                          {link.title}
                        </p>
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
            {/* Login / Signup / Dashboard */}
            <div className="hidden items-center gap-x-4 md:flex">
              {user && user?.accountType !== ACCOUNT_TYPE.INSTRUCTOR && (
                <Link to="/dashboard/cart" className="relative">
                  <AiOutlineShoppingCart className="text-2xl text-richblack-100" />
                  {totalItems > 0 && (
                    <span className="absolute -bottom-2 -right-2 grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-richblack-600 text-center text-xs font-bold text-yellow-100">
                      {totalItems}
                    </span>
                  )}
                </Link>
              )}
              {token === null && (
                <Link to="/login">
                  <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
                    Log in
                  </button>
                </Link>
              )}
              {token === null && (
                <Link to="/signup">
                  <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
                    Sign up
                  </button>
                </Link>
              )}
              {token !== null && <ProfileDropdown />}
            </div>
          </div>
        </div>
      </div>

      {/* mobile div */}
      <div className={`flex h-14 justify-center border-b-[1px] border-b-richblack-700 ${
          location.pathname !== "/" ? "bg-richblack-800" : ""
        } transition-all duration-200 md:hidden relative z-50`}>  
        <div className="flex w-11/12 max-w-maxContent justify-between">
            {/* Logo */}
            <Link to="/" className=" self-center">
              <img src={logo} alt="Logo" width={160} height={32} loading="lazy" />
            </Link>
            {/* Dashboard */}
            <div className="flex items-center justify-end gap-2 md:flex w-full justify-self-end mr-2">
                {token !== null && <ProfileDropdown />}
                {user && user?.accountType !== ACCOUNT_TYPE.INSTRUCTOR && (
                  <Link to="/dashboard/cart" className="relative">
                    <AiOutlineShoppingCart className="text-2xl text-richblack-100" />
                    {totalItems > 0 && (
                      <span className="absolute top-3 -right-2 grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-richblack-600 text-center text-xs font-bold text-yellow-100">
                        {totalItems}
                      </span>
                    )}
                  </Link>
                )}
              </div>
          <button className="relative -right-2 z-30" onClick={Toggle}>
            {
              isOpen? (<AiOutlineClose fontSize={24} fill="#AFB2BF" />) : (<AiOutlineMenu fontSize={24} fill="#AFB2BF" />)
            }
          </button>
        </div>
      </div>
      {
        isOpen && (
          <div className='md:hidden' >
            {/* nav */}
            <div className="flex flex-col items-center justify-center gap-2 absolute z-40 top-0 left-0 right-0 bottom-0 bg-richblack-900">
              <nav className="">
                <ul className="flex flex-col gap-2 items-center text-richblack-25">
                  {NavbarLinks.map((link, index) => (
                    <li key={index}>
                      {link.title === "Catalog" ? (
                        <>
                          <div
                            className={`group relative flex cursor-pointer items-center gap-1 ${
                              matchRoute("/catalog/:catalogName")
                                ? "text-yellow-25"
                                : "text-richblack-25"
                            }`}
                          >
                            <p>{link.title}</p>
                            <BsChevronDown />
                            <div className="invisible absolute left-[50%] top-[50%] z-[1000] flex w-[200px] translate-x-[-50%] translate-y-[3em] flex-col rounded-lg bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[300px]">
                              <div className="absolute left-[50%] top-0 -z-10 h-6 w-6 translate-x-[80%] translate-y-[-40%] rotate-45 select-none rounded bg-richblack-5"></div>
                              {loading ? (
                                <p className="text-center">Loading...</p>
                              ) : subLinks? (
                                <>
                                  {subLinks
                                    ?.filter(
                                      (subLink) => subLink?.courses?.length >= 0
                                    )
                                    ?.map((subLink, i) => (
                                      <Link
                                        to={`/catalog/${subLink.name
                                          .split(" ")
                                          .join("-")
                                          .toLowerCase()}`}
                                        className="rounded-lg bg-transparent py-4 pl-4 hover:bg-richblack-50"
                                        key={i}
                                        onClick={Toggle}
                                      >
                                      
                                      
                                        <p className="text-center">{subLink.name}</p>
                                      </Link>
                                    ))}
                                </>
                              ) : (
                                <p className="text-center">No Courses Found</p>
                              )}
                            </div>
                          </div>
                        </>
                      ) : (
                        <Link to={link?.path} onClick={Toggle}>
                          <p
                            className={`${
                              matchRoute(link?.path)
                                ? "text-yellow-25"
                                : "text-richblack-25"
                            }`}
                          >
                            {link.title}
                          </p>
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </nav>
              {/* Login / Signup / Dashboard */}
              <div className="flex flex-col items-center justify-center gap-2 md:flex w-full ">
                {token === null && (
                  <Link to="/login" className=" w-11/12" onClick={Toggle}>
                    <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100 w-full">
                      Log in
                    </button>
                  </Link>
                )}
                {token === null && (
                  <Link to="/signup" className=" w-11/12" onClick={Toggle}>
                    <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100 w-full">
                      Sign up
                    </button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )
      }
    </div>
    
  )
}

export default Navbar
