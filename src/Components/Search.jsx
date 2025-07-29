import React from 'react'

const Search = ({searchterm,setsearchterm}) => {
  return (
   <div className="search">
    <div>
    <img src='Movies_React_app/search.svg' alt='search'/>
    <input type='text' placeholder='Search thorugh thousnads of movies'
    value={searchterm}
    onChange={(e)=>setsearchterm(e.target.value)}/>
   </div>
   </div>
  )
}

export default Search
