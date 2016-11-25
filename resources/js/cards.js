var grid = new Minigrid({
  container: '.js-cards',
  item: '.js-card',
  gutter: 10
});


document.addEventListener('DOMContentLoaded', function(){
    grid.mount();
});
window.addEventListener('resize', function(){
    grid.mount();
});
