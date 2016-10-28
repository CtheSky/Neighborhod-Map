/**
 * Created by CtheSky on 2016/10/28.
 */
// wiki api
function getWikiSearchUrl(searchStr){
    var wikiUrl = 'http://en.wikipedia.org/w/api.php';
    wikiUrl += '?' + $.param({
            'action': 'opensearch',
            'search': searchStr,
            'format': 'json',
            'callback': 'wikiCallback'
    });
    return wikiUrl;
}