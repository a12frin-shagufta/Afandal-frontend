import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { CiSearch } from "react-icons/ci";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { useLocation } from 'react-router-dom';

const SearchBar = () => {
  const {search , setSearch , showSearch , setShowSearch} = useContext(ShopContext)
  const [visible,setVisible] = useState(false)
  const location = useLocation();
  useEffect(() => {
     if(location.pathname.includes('collection')){
        setVisible(true)
     } 
     else{
      setVisible(false)
     }
  },[location])
  return showSearch && visible ?  (
    <div className='  text-center'>
      <div className="inline-flex items-center justify-center border border-gray-400 px-5 py-2 my-5 mx-3 rounded-full w-3/4 sm:w-1/2">
         <input value={search} onChange={(e) => setSearch(e.target.value) } type="text" placeholder='Search Product' className='flex-1 outline-none bg-inherit text-sm' />
         <CiSearch className='text-2xl ' />
      </div>
     <IoIosCloseCircleOutline onClick={() => setShowSearch(false)} className='text-2xl inline cursor-pointer '/>

      

    </div>
  ): null
}

export default SearchBar