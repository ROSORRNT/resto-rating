import React from 'react'


const NavBar = ()  => {
// nav-wrapper #ffcc80 orange lighten-2
    return (
    
<nav className="#ffcc80 orange lighten-2">
  <div className="nav-wrapper">
      <form >
        <div>
          <input id="add" type="add" required/>
          <label className="label-icon" htmlFor="add"><i className="material-icons">add</i></label>
          <i className="material-icons">close</i>
        </div>
      </form>
  </div>
</nav>


    )
}

export default NavBar
