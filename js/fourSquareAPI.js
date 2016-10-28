/**
 * Created by CtheSky on 2016/10/28.
 */
// four square api
var four_square_api_url = 'https://api.foursquare.com/v2/venues/search';
var client_id = 'M4AEZXQ1L323SOIGNNQCUDQEI5RFNFJSEQWNKIC2K2QRLTXH';
var client_secret = '0Q1JX55KHE5D1EPJLAESUFENVW4NK2STT2NGXR33WHJOKTFG';
var four_square_request_url = four_square_api_url + '?' + $.param({
        client_id: client_id,
        client_secret: client_secret,
        v: 20130815,
        ll: ' 40.7,-74',
        query: 'museum'
});