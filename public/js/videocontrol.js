function rewind(video) {
  video.pause();
  video.currentTime=0;
}


function handleScroll(index,direction) {
  console.log(index);
  console.log(direction);
  var video1 = $('#video1').get(0);
  var video2 = $('#video2').get(0);
  var video3 = $('#video3').get(0);
  var video4 = $('#video4').get(0);

  switch(index)  {
  case 0:
    video1.play();
    rewind(video2);
    rewind(video3);
    rewind(video4);

    break;
  case 2:
    video2.play();
    rewind(video1);
    rewind(video3);
    rewind(video4);

    break;
  case 4:
    video3.play();
    rewind(video1);
    rewind(video2);
    rewind(video4);

    break;
  case 6:
    video4.play();
    rewind(video1);
    rewind(video2);
    rewind(video3);

    break;
  }
}


      // var video1 = $('#video1').get(0);
      // var video2 = $('#video2').get(0);
      // var video3 = $('#video3').get(0);
      // var video4 = $('#video4').get(0);
      // video1.addEventListener('ended',function(clip){video1.removeEventListener('ended');$.fn.fullpage.moveSlideDown();},false);
      // video2.addEventListener('ended',function(clip){video2.removeEventListener('ended');$.fn.fullpage.moveSlideDown();},false);
      // video3.addEventListener('ended',function(clip){video3.removeEventListener('ended');$.fn.fullpage.moveSlideDown();},false);
      // video4.addEventListener('ended',function(clip){video4.removeEventListener('ended');$.fn.fullpage.moveSlideDown();},false);
