function rewind(video) {
  video.pause();
  video.currentTime=Math.round(video.duration);
}

function ff(video){
  if(!video.paused) video.playbackRate=8;
}

function handleScroll(index,direction) {
  console.log(index);
  console.log(direction);
  var video1 = $('#video1').get(0);
  var video2 = $('#video2').get(0);
  var video3 = $('#video3').get(0);
  var video4 = $('#video4').get(0);
  var video5 = $('#video5').get(0);

  
  switch(index)  {
  case 0:
    video1.currentTime=0;
    video1.play();
    rewind(video2);
    rewind(video3);
    rewind(video4);
    rewind(video5);
    break;
  case 2:
    video2.currentTime=0;
    video2.play();
    rewind(video1);
    rewind(video3);
    rewind(video4);
    rewind(video5);
    break;
  case 4:
    video3.currentTime=0;
    video3.play();
    rewind(video1);
    rewind(video2);
    rewind(video4);
    rewind(video5);
    break;
  case 6:
    video4.currentTime=0;
    video4.play();
    rewind(video1);
    rewind(video2);
    rewind(video3);
    rewind(video5);
    break;
  case 8:
    video5.currentTime=0;
    video5.play();
    rewind(video1);
    rewind(video2);
    rewind(video3);
    rewind(video4);
    break;
  default:
    // rewind(video1);
    // rewind(video2);
    // rewind(video3);
    // rewind(video4);
    // rewind(video5);
    break;
  }
}


