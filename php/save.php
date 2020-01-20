<?php
    var_dump($_POST['tableData']);
    $post_data = $_POST['tableData'];
    $filename ='../data/data.dat';
    $handle = fopen($filename, "w");      

    if (empty($post_data)) {   
        print_r($handle, ' Hmm, I did NOT get any data from AJAX. myText is:  '. $post_data);  
    }
    if (!empty($post_data)) {
        fwrite($handle, $post_data);
    }
    fclose($handle);
?>