function getRandom (size)
{
  return Math.floor(Math.random() * size);
}

//Creating the layers for the stars
for (i = 2; i < 12; i++)
{
  $("#stars").append('<div class="star_layer" style="transform: translateZ(' + i + 'px) scale(' + (15 - i)/(15) +');"></div>')
}

//Creating the stars
for (i = 0; i < 70; i++)
{
  $(".star_layer").eq(getRandom(10)).append('<div class="star"></div>');
}

updateStars();

//Change stars every cycle
setInterval(updateStars, 4000);

//Randomising stars. Position and opacity is changed every cycle.
function updateStars ()
{
  $(".star").each(function() {
    $(this).css({"top": getRandom(200) + "px", "left": getRandom(200) + "px", "opacity": (20 + getRandom(50))/100});
  });
}