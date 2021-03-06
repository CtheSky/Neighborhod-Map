/**
 * Created by CtheSky on 2016/10/28.
 */
// knockout viewmodel
function LocationsViewModel(){
    var self = this;

    self.filterKeyword = ko.observable('');
    self.locations = ko.observableArray();
    self.fourSquareLoadingInfo = ko.observable();

    // Computed
    self.filterLocations = ko.computed(function(){
        if (!self.filterKeyword()) {
            // No filterKeyword set all markers on the map
            for(var i = 0; i < self.locations().length; i++) {
                self.locations()[i].marker.setVisible(true);
                markerBounce(self.locations()[i].marker);
            }
            return self.locations();
        } else {
            // Use keyword to filter locations
            var filterLocations = ko.utils.arrayFilter(self.locations(), function(location) {
               return location.name.toLowerCase().indexOf(self.filterKeyword().toLowerCase()) !== -1;
            });

            // Hide all markers
            for(var i = 0; i < self.locations().length; i++) {
                self.locations()[i].marker.setVisible(false);
            }

            // Show required markers
            for(var i = 0; i < filterLocations.length; i++) {
                filterLocations[i].marker.setVisible(true);
                markerBounce(filterLocations[i].marker);
            }

            return filterLocations;
        }
    });

    // Operations
    self.init = function() {
        self.fourSquareLoadingInfo('Loading data from FourSquare...');
        $.get(four_square_request_url, function(data) {
            // Get data success, remove loading data info
            self.fourSquareLoadingInfo('');

            $.each(data.response.venues, function addLocation(index, location){
                // if (index > 22) return;
                location.marker = new google.maps.Marker({
                    position: location.location,
                    map: map,
                    title: location.name,
                    animation: google.maps.Animation.DROP
                });
                location.marker.setMap(map);
                location.marker.addListener('click', function (){
                    markerBounce(location.marker);
                    self.showInfo(location);
                });
                self.locations.push(location);
            });
        }).fail(function(){
            self.fourSquareLoadingInfo('Failed to load data from FourSquare.');
        });
    };

    self.showInfo = function (location) {
        // Add location name and possible contact
        var content = '<h2>' + location.name + '</h2>' +
            '<h4>Contact</h4><div>';
        if (location.contact.formattedPhone) {
            content += '<a class="zocial icon call" title="' + location.contact.formattedPhone + '"></a>';
        }
        if (location.contact.facebook) {
            content += '<a class="zocial icon facebook" href="https://www.facebook.com/' + location.contact.facebook + '"></a>';
        }
        if (location.contact.twitter) {
            content += '<a class="zocial icon twitter" href="https://www.twitter.com/' + location.contact.twitter + '"></a>';
        }
        content += '</div>';

         // Get location info from wikipedia
        content += '<div id="location_info_content">Loading data from wikipedia...</div>';
        $.ajax({
            url: getWikiSearchUrl(location.name),
            dataType: 'jsonp',
            success: function(response) {
                var articleList = response[1];
                var wikiContent = '<h4>Wikipedia Links</h4><ul>';
                for (var i = 0; i < articleList.length; i++) {
                    articleStr = articleList[i];
                    var url = 'http://en.wikipedia.org/wiki/' + articleStr;
                    wikiContent += '<li><a href="' + url + '">"'+ articleStr + '"</a></li>';
                }
                // Add message if there is no wikipedia link
                if (articleList.length == 0)
                    wikiContent += '<li>No wikipedia link of location is available.</li>';
                wikiContent += '</ul>';
                $('#location_info_content').html(wikiContent);
            }
        }).fail(function (){
            $('#location_info_content').html('Failed to load data from Wikipedia.');
        });

        // Animate marker
        markerBounce(location.marker);

        // Show infowindow
        infowindow.setContent(content);
        infowindow.open(map, location.marker);
    };

    // Initialize map with default locations
    self.init();
}