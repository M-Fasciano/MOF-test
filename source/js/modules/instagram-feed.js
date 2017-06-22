var $ = require('jquery');

var output = [];

var instagramCall = {
    options: {
        token: '242936178.1677ed0.44bd6c4c05d342c0b87deb2afb61f8e2',
        userid: 242936178,
        num_photos: 10,
        instagram: '.instagram'
    },
    init: function() {
        var self = this;

        $.ajax({
            url: 'https://api.instagram.com/v1/users/' + self.options.userid + '/media/recent',
            dataType: 'jsonp',
            type: 'GET',
            data: {
                access_token: self.options.token, 
                count: self.options.num_photos
            },
            success: function(data) {
                console.log(data.data)
                for(x in data.data) {
                    output.push(data.data[x].images.low_resolution.url)
                }
            }
        }).done(function() {

            self.randImgOne()
            self.randImgTwo()

            $(self.options.instagram + '--cta').on('click', function() {

                var dataContainer = $(this).data('cta');
            
                if(dataContainer == 'one') {
                    self.randImgOne()
                } else {
                    self.randImgTwo()
                }
                
            })

        });
    },
    randImgOne: function() {
        var self = this,
            x = Math.floor(Math.random() * 10);

        $(self.options.instagram + '--image' + '[data-image-container="one"]').html('<img src="' + output[x] + '">');
    },
    randImgTwo: function() {
        var self = this,
            reverse = self.shuffle(output);

        $(self.options.instagram + '--image' + '[data-image-container="two"]').html('<img src="' + reverse + '">');
    },
    shuffle: function(array) {
        var currentIndex = array.length,
            temporaryValue,
            randomIndex;

        while (0 !== currentIndex) {

            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }
}

module.exports = instagramCall;