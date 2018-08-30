<?php
$repeater = $instance['slider_widget_repeater'];
$sliderImageID = $instance['slider_image'];
$sliderTitle = $instance['slider_title'];
$sliderImage = wp_get_attachment_url($sliderImageID);
?>

<section class="slider-widget-container">
        <div class="slider-widget-inner" style="background-image:url(<?=$sliderImage ?>)">
            <div class="testimonial-title">
                <h1><?=$sliderTitle ?></h1>
            </div>
            <div class="testimonial-slider">
                <?php foreach($repeater as $index => $slide){
                    $sliderBody = $slide['slider_body'];
                    $sliderAuthor = $slide['slider_author'];
                ?>
                    <div class="slide">
                        <div class="slide-inner">
                            <p class="testimonial-paragraph"><?=$sliderBody; ?></P>
                        </div> 
                        <h3>-<?=$sliderAuthor ?></h3>
                    </div>
                <?php }; ?>
            </div>
        </div>
    
  </section>