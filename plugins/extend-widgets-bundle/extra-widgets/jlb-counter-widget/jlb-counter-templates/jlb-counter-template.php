<?php
$countStart = $instance['counter_number_start'];
$countEnd = $instance['counter_number_end'];
$countSpeed = $instance['counter_speed'];
$heading = $instance['heading'];
$position = $instance['position'];
$display = <<<HTML
    <div class="counter-holder">
      <$heading style="text-align:$position;" class="timer count-title count-number" data-to="$countEnd" data-speed="$countSpeed" data-start="$countStart"></$heading>
    </div>
HTML;
  echo $display; ?>
