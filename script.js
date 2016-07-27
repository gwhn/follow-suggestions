(function (global) {
    'use strict';
    var $ = global.$, Rx = global.Rx;
    $(function () {
        var $suggestions = $('.suggestions')[0];
        var $refreshButton = $('.refresh', $suggestions)[0];
        var refreshClickStream = Rx.Observable.fromEvent($refreshButton, 'click');
        var requestStream = refreshClickStream
            .startWith('startup click')
            .map(function () {
            var offset = Math.floor(Math.random() * 500);
            return "https://api.github.com/users?since=" + offset;
        });
        var responseStream = requestStream
            .flatMap(function (url) {
            return Rx.Observable.fromPromise($.getJSON(url));
        })
            .publish()
            .refCount();
        var randomUser = function (click, list) {
            return list[Math.floor(Math.random() * list.length)];
        };
        var updateSuggestion = function ($parent, data) {
            if (data) {
                $('img.media-object', $parent)
                    .attr('src', data.avatar_url)
                    .attr('alt', data.login);
                $('a.user-login', $parent)
                    .attr('href', data.html_url)
                    .text(data.login);
                $parent.css('display', 'block');
            }
            else {
                $parent.css('display', 'none');
            }
        };
        var createSuggestionStream = function (closeClickStream) {
            return closeClickStream
                .startWith('startup click')
                .combineLatest(responseStream, randomUser)
                .merge(refreshClickStream.map(function () {
                return null;
            }))
                .startWith(null);
        };
        var $close1Button = $('.suggestion1 .close', $suggestions)[0];
        var close1ClickStream = Rx.Observable.fromEvent($close1Button, 'click');
        createSuggestionStream(close1ClickStream)
            .subscribe(function (res) {
            updateSuggestion($('.suggestion1', $suggestions), res);
        });
        var $close2Button = $('.suggestion2 .close', $suggestions)[0];
        var close2ClickStream = Rx.Observable.fromEvent($close2Button, 'click');
        createSuggestionStream(close2ClickStream)
            .subscribe(function (res) {
            updateSuggestion($('.suggestion2', $suggestions), res);
        });
        var $close3Button = $('.suggestion3 .close', $suggestions)[0];
        var close3ClickStream = Rx.Observable.fromEvent($close3Button, 'click');
        createSuggestionStream(close3ClickStream)
            .subscribe(function (res) {
            updateSuggestion($('.suggestion3', $suggestions), res);
        });
    });
})(this);
//# sourceMappingURL=script.js.map