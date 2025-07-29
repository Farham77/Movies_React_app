import React from 'react'

const Search = ({searchterm,setsearchterm}) => {
  return (
   <div className="search">
    <div>
    <img src='./search.svg' alt='search'/>
    <input type='text' placeholder='Search through thousands of movies'
    value={searchterm}
    onChange={(e)=>setsearchterm(e.target.value)}/>
   </div>
   </div>
  )
}

export default Search
