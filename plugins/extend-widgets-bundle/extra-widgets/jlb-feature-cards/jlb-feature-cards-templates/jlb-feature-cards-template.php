<?php
$repeater = $instance['card_repeater'];
?>
<div class="card-container">
  <?php foreach($repeater as $index => $slide){
    $cardTitle = $slide['title_text'];
    $cardText = $slide['card_text'];
    $linkText = $slide['link_text'];
    $link = $slide['link'];
    $imageID = $slide['card_media'];
    $imageURL = wp_get_attachment_url($imageID);
    $display = <<<HTML
  <div class="card-holder">
    <div class="card-inner">
      <div class="image-holder" style="background-image:url($imageURL);"></div>
      <div class="text-holder">
        <h5>$cardTitle</h5>
        <p>$cardText</p>
        <a href="$link"><button>$linkText</button></a>
      </div>
    </div>
  </div>
HTML;
  echo $display;
 }; ?>
</div>
