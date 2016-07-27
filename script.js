(function (global) {
    'use strict';
    var $ = global.$, Rx = global.Rx;
    $(function () {
        var refreshButton = $('#suggestions .refresh')[0];
        var refreshClickStream = Rx.Observable.fromEvent(refreshButton, 'click');
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
        var close1Button = $('#suggestion1 .close')[0];
        var close1ClickStream = Rx.Observable.fromEvent(close1Button, 'click');
        var suggestion1Stream = close1ClickStream
            .startWith('startup click')
            .combineLatest(responseStream, randomUser)
            .merge(refreshClickStream.map(function () {
            return null;
        }))
            .startWith(null);
        suggestion1Stream.subscribe(function (res) {
            updateSuggestion($('#suggestion1'), res);
        });
        var close2Button = $('#suggestion2 .close')[0];
        var close2ClickStream = Rx.Observable.fromEvent(close2Button, 'click');
        var suggestion2Stream = close2ClickStream
            .startWith('startup click')
            .combineLatest(responseStream, randomUser)
            .merge(refreshClickStream.map(function () {
            return null;
        }))
            .startWith(null);
        suggestion2Stream.subscribe(function (res) {
            updateSuggestion($('#suggestion2'), res);
        });
        var close3Button = $('#suggestion3 .close')[0];
        var close3ClickStream = Rx.Observable.fromEvent(close3Button, 'click');
        var suggestion3Stream = close3ClickStream
            .startWith('startup click')
            .combineLatest(responseStream, randomUser)
            .merge(refreshClickStream.map(function () {
            return null;
        }))
            .startWith(null);
        suggestion3Stream.subscribe(function (res) {
            updateSuggestion($('#suggestion3'), res);
        });
    });
})(this);
//# sourceMappingURL=script.js.map