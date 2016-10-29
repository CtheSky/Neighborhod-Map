/**
 * Created by CtheSky on 2016/10/28.
 */
// knockout viewmodel
function LocationsViewModel(){
    var self = this;

    self.filterKeyword = ko.observable('');
    self.locations = ko.observableArray();

    // Computed 
    self.filterLocations = ko.computed(function(){
        if (!self.filterKeyword()) {
            // No filterKeyword set all markers on the map
            for(var i = 0; i < self.locations().length; i++) {
                self.locations()[i].marker.setMap(map);
                markerBounce(self.locations()[i].marker);
            }
            return self.locations();
        } else {
            // Use keyword to filter locations
            var filterLocations = ko.utils.arrayFilter(self.locations(), function(location) {
               return location.name.toLowerCase().indexOf(self.filterKeyword().toLowerCase()) !== -1;
            });

            // Remove all markers
            for(var i = 0; i < self.locations().length; i++) {
                self.locations()[i].marker.setMap(null);
            }

            // Add required markers
            for(var i = 0; i < filterLocations.length; i++) {
                filterLocations[i].marker.setMap(map);
                markerBounce(filterLocations[i].marker);
            }

            return filterLocations;
        }
    });

    // Operations
    self.init = function() {
        $.get(four_square_request_url, function(data) {
            // Get data success, remove loading data info
            $('#data_loading_info').html('');

            $.each(data.response.venues, function addLocation(index, location){
                if (index > 22) return;
                location.isRequired = ko.computed(function(){
                    if (this.name.includes(self.filterKeyword()))
                        return true;
                }, location);
                location.marker = new google.maps.Marker({
                    position: location.location,
                    map: map,
                    title: location.name,
                    animation: google.maps.Animation.DROP
                });
                location.marker.addListener('click', function (){
                    console.log('click marker');
                    markerBounce(location.marker);
                    self.showInfo(location);
                });
                self.locations.push(location);
            });
        }).fail(function(){
            $('#data_loading_info').html('Failed to load data from FourSquare.');
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

        var wikiRequestTimeout = setTimeout(function(){
            $('#location_info_content').html('Failed to load data from Wikipedia.');
        }, 10000);

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
                wikiContent += '</ul>';
                $('#location_info_content').html(wikiContent);
                    clearTimeout(wikiRequestTimeout);
            }
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

ko.applyBindings(new LocationsViewModel());