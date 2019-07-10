var musiclist = []
var currentIndex = 0
var audio = new Audio()
audio.autoplay = true

function $(selector) {
    return document.querySelector(selector)
}
function $$(selector) {
    return document.querySelectorAll(selector)
}

function getMusicList(callback) {
    var xhr = new XMLHttpRequest()
    xhr.open('GET', 'https://kofechen.github.io/MusicBox/music.json', true)
    xhr.onload = function() {
        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
            callback(JSON.parse(xhr.responseText))
        } else {
            console.log("404 Not Found")
        }
    }
    xhr.onerror = function() {
        console.log("服务器异常")
    }
    xhr.send();
}

function loadMusic(musicObj) {
    audio.src = musicObj.src 
    audio.title = musicObj.title
    $('.music-box .info .title').innerText = musicObj.title
    $('.music-box .info .singer').innerText = musicObj.singer
    $('.bgd').style.backgroundImage = 'url(/img' + musicObj.img + ')'
}

function loadList(list) {
    for (var i = 0; i < list.length; i++) {
        var newLi = document.createElement('li')
        var newContent = document.createTextNode(list[i].title + '-' + list[i].singer)
        newLi.appendChild(newContent)
        $('.musiclist').appendChild(newLi)
    }
}

getMusicList(function(list) {
    musiclist = list
    loadMusic(musiclist[currentIndex])
    loadList(musiclist)
})

$('.control .play').onclick = function() {
    if (audio.paused) {
        audio.play()
        $('.control .play .iconfont').classList.add('icon-pause')
        $('.control .play .iconfont').classList.remove('icon-play')
    } else {
        audio.pause()
        $('.control .play .iconfont').classList.remove('icon-pause')
        $('.control .play .iconfont').classList.add('icon-play')
    }
}

$('.control .next').onclick = function() {
    currentIndex = ++currentIndex % musiclist.length
    audio.src = musiclist[currentIndex].src
    loadMusic(musiclist[currentIndex])
}

$('.control .back').onclick = function() {
    currentIndex = (musiclist.length + --currentIndex) % musiclist.length
    audio.src = musiclist[currentIndex].src
    loadMusic(musiclist[currentIndex])
}

$('.progress .bar').onclick = function(e) {
    var percent = e.offsetX / parseInt(getComputedStyle(this).width)
    $('.bar .progress-now').style.width = percent*100 + '%'
    audio.currentTime = audio.duration * percent
}

$('.musiclist').onclick = function(e) {
    var strTitle = e.target.innerText.split('-')
    for (var j = 0; j < musiclist.length; j++) {
        if (strTitle[0] === musiclist[j].title) {
            loadMusic(musiclist[j])
        }
    }
}

$('.setvolume .volume').onclick = function(e) {
    var percent = e.offsetX / parseInt(getComputedStyle(this).width)
    audio.volume = percent
    $('.setvolume .volume .vol').style.width = percent*100 + '%'
    $('.setvolume .percentage').innerText = 'vol:' + Math.floor(percent*100) +'%'
}

audio.onplay = function() {
    clock = setInterval(function() {
        var min = Math.floor(audio.currentTime/60)
        var sec = Math.floor(audio.currentTime)%60 + ''
        sec = sec.length == 2 ? sec : '0' + sec
        $('.progress .time').innerText = min + ':' + sec
    }, 1000)

    $('.control .play .iconfont').classList.add('icon-pause')
    $('.control .play .iconfont').classList.remove('icon-play')

    $$('.musiclist>li').forEach(function(e) {
        if (e.innerText.split('-')[0] === audio.title) {
            e.classList.add('playing')
        } else {
            e.classList.remove('playing')
        }
    })
}

audio.ontimeupdate = function() {
    $('.bar .progress-now').style.width = (audio.currentTime/audio.duration)*100 + '%'
}

audio.onended = function() {
    currentIndex = ++currentIndex % musiclist.length
    audio.src = musiclist[currentIndex].src
    loadMusic(musiclist[currentIndex])
}
