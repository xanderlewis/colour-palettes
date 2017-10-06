window.addEventListener('load', function () {
    const tweetLink = document.getElementById('tweet-palette-link');
    tweetLink.addEventListener('click', function () {
        let intentURL = 'https://twitter.com/intent/tweet';
        intentURL += '?text=' + encodeURIComponent('I just generated a colour palette from an image using a tool by @xndrlws! 🎨✨');
        intentURL += '&url=' + encodeURIComponent(window.location.href.split('?')[0]); // (without query string)
        intentURL += '&hashtags=' + 'fun,colours';

        window.open(intentURL);
    });
});