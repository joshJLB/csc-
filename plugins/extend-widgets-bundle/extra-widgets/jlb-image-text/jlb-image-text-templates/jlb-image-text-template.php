<?php
$image = wp_get_attachment_url($instance['image']);
$title = $instance['image-text'];
$content = $instance['image-content'];
?>

<div class="image-text-container">
    <div class="image-text-inner">
        <div class="image-text-wrapper">
            <img src="<?=$image?>" alt="">
        </div>
        <div class="image-text-content">
            <h2><?=$title?></h2>
            <p><?=$content?></p>
        </div>
    </div>
</div>