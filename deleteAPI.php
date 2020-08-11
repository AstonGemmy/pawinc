<?php
    
    if (!isset($_SERVER['PHP_AUTH_USER'])) {
        header('WWW-Authenticate: Basic realm="PAW Realm"');
        header('HTTP/1.0 401 Unauthorized');
        echo "Authentication failed!";
        exit;
    } else {
        $username = "aston";
        $password = "root";        
        if (($_SERVER['PHP_AUTH_USER'] == $username) && ($_SERVER['PHP_AUTH_PW'] == $password)) {
            $contentType = isset($_SERVER["CONTENT_TYPE"]) ? trim($_SERVER["CONTENT_TYPE"]) : '';
            $requestMethod = $_SERVER['REQUEST_METHOD'];
            if ($requestMethod === "POST") {
                if ($contentType === "application/json") {
                    $content = json_decode(trim(file_get_contents("php://input")));
                    $data__COUNT = count($content);
                    // for ($i = 0; $i < $data__COUNT; $i++) {
                    //     echo $content[$i];
                    // }
                    $tense__FORM = $data__COUNT > 1 ? "s" : "";
                    echo "{$data__COUNT} item{$tense__FORM} successfully deleted";
                } else {
                    echo "Invalid content type";
                    exit;
                }
            } else {
                echo "Invalid application request type";
                exit;
            }
        } else {
            echo "Unauthorized access";
            exit;
        }

    }

?>