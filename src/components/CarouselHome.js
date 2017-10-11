import React from 'react'
import '../style/CarouselHome.css'
import { Carousel } from 'react-bootstrap'
import MediaQuery from 'react-responsive'
import { CarouselHomeContent } from '../lib/contentful'

class CarouselHome extends React.Component {
  constructor(props) {
    super(props)

    this._onTouchStart = this._onTouchStart.bind(this)
    this._onTouchMove = this._onTouchMove.bind(this)
    this._onTouchEnd = this._onTouchEnd.bind(this)

    this.state = {
      index: 0,
      direction: null,
      slides: [],
      currentLocale: 'en-US'
    }

    this._swipe = {}
    this.minDistance = 50
    this.countSlides = 3
  }

  componentDidMount() {
    CarouselHomeContent()
      .then(response => {
        const slides = response.items.map(item => item.fields)
        this.setState({ slides })
      })
      .catch(error => {
        console.error(error)
      })
  }

  _onTouchStart(e) {
    const touch = e.touches[0]
    this._swipe = { x: touch.clientX }
  }

  _onTouchMove(e) {
    if (e.changedTouches && e.changedTouches.length) {
      this._swipe.swiping = true
    }
  }

  _onTouchEnd(e) {
    const touch = e.changedTouches[0]
    const absX = Math.abs(touch.clientX - this._swipe.x)
    if (this._swipe.swiping && absX > this.minDistance ) {
      if (touch.clientX > this._swipe.x) {
        this.setState({
          index: this.state.index === 0 ? this.countSlides - 1 : this.state.index - 1,
          direction: 'prev'
        })
      } else {
        this.setState({
          index: this.state.index === this.countSlides - 1 ? 0 : this.state.index + 1,
          direction: 'next'
        })
      }
    }
    this._swipe = {}
  }

  handleSelect = (selectedIndex, e) => {
    this.setState({
      index: selectedIndex,
      direction: e.direction
    })
  }

  render() {

    if (this.state.slides) {

      const rows = []
      const _this = this

      this.state.slides.forEach(function(data) {
        rows.push(
          <Carousel.Item key={data.order['en-US']} onTouchStart={_this._onTouchStart} onTouchMove={_this._onTouchMove} onTouchEnd={_this._onTouchEnd}>
            <MediaQuery query='(min-device-width: 450px)'>
              <img title={ data.imageTitle[_this.state.currentLocale] } alt={ data.imageTitle[_this.state.currentLocale] } src={ data.imageLarge['en-US'].fields.file['en-US'].url} />
            </MediaQuery>
            <MediaQuery query='(max-device-width: 449px)'>
              <img title={ data.imageTitle[_this.state.currentLocale] } alt={ data.imageTitle[_this.state.currentLocale] } src={ data.imageSmall['en-US'].fields.file['en-US'].url} />
            </MediaQuery>
            <Carousel.Caption>
              <h3>{ data.title[_this.state.currentLocale] }</h3>
              <p>{ data.body[_this.state.currentLocale] }</p>
            </Carousel.Caption>
          </Carousel.Item>
        )
      })

      return (
        <Carousel activeIndex={this.state.index} direction={this.state.direction} onSelect={this.handleSelect}>
          {rows}
        </Carousel>
      )
    } else {
      return (
        <div>There was a problem.</div>
      )

    }

  }
}

export default CarouselHome
