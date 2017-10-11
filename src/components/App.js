import React, { Component } from 'react'
import logo from '../images/logo.svg'
import '../style/App.css'
import CarouselHome from './CarouselHome'

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
        </header>
        <div>
          <CarouselHome />
        </div>
      </div>
    );
  }
}

export default App
