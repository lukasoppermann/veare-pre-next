if( document.location.host.substring(0,9) === 'localhost' ) {
  ready(() => {
    let style = document.createElement('style')
    style.type = 'text/css'
    let css = `
      .dev-grid{
        pointer-events: none;
        position: fixed;
        width: 100%;
        height: 100vh;
        display: block;
        z-index: 999;
      }
      .dev-grid-button{
        pointer-events: all;
        position: fixed;
        display: block;
        bottom: 0;
        right: 0;
        padding: 10px 15px;
        background-color: rgb(255,255,255);
        font-size: 16px;
        border-radius: 3px;
        margin: 10px;
        box-shadow: 0 2px 5px rgba(0,0,0,.15);
        cursor: pointer;
        border: 1px solid rgb(225,225,225);
      }
      .dev-grid-button:hover{
        box-shadow: 0 1px 2px rgba(0,0,0,.15)
      }
      .dev-grid .row{
        width: 100%;
        height: 100px;
      }
      .col-md-1{
        box-shadow: inset 0 0 0 1px blue;
      }
    `
    style.appendChild(document.createTextNode(css))

    document.head.append(style)
    let devGrid = document.createElement('div')
    devGrid.display = 'block';
    devGrid.classList.add('dev-grid')
    let innerHTML = '<div class="dev-grid-button">Toggle Grid</div><div class="dev-grid-inner">'

    for(a = 6; a > 0; a--){
      innerHTML += '<div class="row">'
      for(i = 12; i > 0; i--){
        innerHTML += '<div class="col-lg-1 col-md-1 col-sm-1"></div>'
      }
      innerHTML += '</div>'
    }

    devGrid.innerHTML = innerHTML + '</div>'

    document.body.append(devGrid)

    document.querySelector('.dev-grid-button').addEventListener('click', () => {
      let display = {
        'block': 'none',
        'none': 'block'
      }
      document.querySelector('.dev-grid-inner').style.display = display[devGrid.display]
      devGrid.display = display[devGrid.display]
    })
  })
}
