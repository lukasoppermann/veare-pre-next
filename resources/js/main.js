Array.prototype.forEach.call(document.querySelectorAll('pre > code'), function(item){
    item.classList.add('line-numbers');
});
