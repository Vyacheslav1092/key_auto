<?php

$curl = curl_init();

curl_setopt_array($curl, array(
    CURLOPT_URL => 'https://api.mindbox.ru/v3/operations/sync?endpointId=keyauto.ru&operation=RegistrationEvent',
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_ENCODING => '',
    CURLOPT_MAXREDIRS => 10,
    CURLOPT_TIMEOUT => 0,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
    CURLOPT_CUSTOMREQUEST => 'POST',
    CURLOPT_POSTFIELDS =>'{
  "customer": {
    "email": "'.$_POST['Email'].'",
    "firstName": "'.$_POST['Name'].'",
    "lastName": "'.$_POST['Family'].'",
    "mobilePhone": "'.$_POST['Tel'].'",
    "customFields": {
      "city": "'.$_POST['City'].'",
    },
    "subscriptions": [
      {
        "brand": "Keyauto",
        "pointOfContact": "Email",
        "isSubscribed": true
      }
    ]
  },
  "customerAction": {
    "customFields": {     
      "eventDate": "15.02.2023",
      "eventName": "Презентация новой Toyota Avalon",
      "userCategoryEvent": "'.$_POST['Role'].'",
      "utmSourseEvent": "'.$_GET['utm_source'].'",
    }
  }
}',
    CURLOPT_HTTPHEADER => array(
        'Authorization: Mindbox secretKey="Y5wCjHFjrlC1wtwFJpfP"',
        'Content-Type: application/json'
    ),
));

$response = curl_exec($curl);

curl_close($curl);
echo $response;
