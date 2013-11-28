function rewind(video) {
  video.pause();
  video.currentTime=video.duration;
}

function ff(video){
  if(!video.paused) video.playbackRate=8;
}

function handleScroll(index,direction) {
  var video1 = $('#video1').get(0);
  var video2 = $('#video2').get(0);
  var video3 = $('#video3').get(0);
  var video4 = $('#video4').get(0);
  var video5 = $('#video5').get(0);

  $('#note1').hide();
  $('#note2').hide();
  $('#note3').hide();
  $('#note4').hide();
  $('#note5').hide();
  
  switch(index)  {
  case 0:
    video1.currentTime=0;
    video1.play();
    rewind(video2);
    rewind(video3);
    rewind(video4);
    rewind(video5);
    break;
  case 1:
    video2.currentTime=0;
    video2.play();
    rewind(video1);
    rewind(video3);
    rewind(video4);
    rewind(video5);
    break;
  case 2:
    video3.currentTime=0;
    video3.play();
    rewind(video1);
    rewind(video2);
    rewind(video4);
    rewind(video5);
    break;
  case 3:
    video4.currentTime=0;
    video4.play();
    rewind(video1);
    rewind(video2);
    rewind(video3);
    rewind(video5);
    break;
  case 4:
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

function addEventListener() {
  $(document).ready(function(){
    var video1 = $('#video1').get(0);
    var video2 = $('#video2').get(0);
    var video3 = $('#video3').get(0);
    var video4 = $('#video4').get(0);
    var video5 = $('#video5').get(0);
    video1.addEventListener('ended',function(){console.log("video1 end");$('#note1').show();},false);
    video2.addEventListener('ended',function(){console.log("video2 end");$('#note2').show();},false);
    video3.addEventListener('ended',function(){console.log("video3 end");$('#note3').show();},false);
    video4.addEventListener('ended',function(){console.log("video4 end");$('#note4').show();},false);
    video5.addEventListener('ended',function(){console.log("video5 end");$('#note5').show();},false);
    video1.addEventListener('timeupdate',function(){var cur=$(this).get(0).currentTime;var total=$(this).get(0).duration;if(total-cur<1.5){$('#note1').fadeIn('slow');}},false);
    video2.addEventListener('timeupdate',function(){var cur=$(this).get(0).currentTime;var total=$(this).get(0).duration;if(total-cur<3){$('#note2').fadeIn('slow');}},false);
    video3.addEventListener('timeupdate',function(){var cur=$(this).get(0).currentTime;var total=$(this).get(0).duration;if(total-cur<2){$('#note3').fadeIn('slow');}},false);
    video4.addEventListener('timeupdate',function(){var cur=$(this).get(0).currentTime;var total=$(this).get(0).duration;if(total-cur<2){$('#note4').fadeIn('slow');}},false);
    video5.addEventListener('timeupdate',function(){var cur=$(this).get(0).currentTime;var total=$(this).get(0).duration;if(total-cur<2){$('#note5').fadeIn('slow');}},false);

  });
}

