
 // $(window).scroll(function() {
 //    if ($(".navbar").offset().top > 50) {
 //        // $(".navbar-fixed-top").addClass("top-nav-collapse");
 //    } else {
 //        $(".navbar-fixed-top").removeClass("top-nav-collapse");
 //    }
 //    });



    // Closes the Responsive Menu on Menu Item Click
    $('.navbar-collapse ul li a').click(function() {
        $('.navbar-toggle:visible').click();
    });
    

 // $('.carousel').carousel({
 //        interval: 5000 //changes the speed
 //    });